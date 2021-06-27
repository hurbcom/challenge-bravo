from django.core.management import BaseCommand
from django.core.management import call_command
from django.db import connection
import os
import shutil
import re
import tempfile

def delete_line(filename, pattern, stdout):
    pattern_compiled = re.compile(pattern)
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as tmp_file:
        with open(filename) as src_file:
            for line in src_file:
                if pattern_compiled.findall(line):
                    stdout.write('Deleting line in %s' % filename)
                    continue
                tmp_file.write(line)

    # Overwrite the original file with the munged temporary file in a
    # manner preserving file attributes (e.g., permissions).
    shutil.copystat(filename, tmp_file.name)
    shutil.move(tmp_file.name, filename)


class Command(BaseCommand):
    help = "Delete all migrations from one app, reset database and create one new migration"

    def __init__(self, *args, **kwargs):
        self.cursor = connection.cursor()
        return super(Command, self).__init__(*args, **kwargs)

    def add_arguments(self, parser):
        parser.add_argument('apps', nargs='+', type=str)

        # Named (optional) arguments
        parser.add_argument('--cached',
                            action='store_true',
                            dest='cached',
                            default=False,
                            help='Dont delete the migrations files')

    def delete_database_app(self, app):
        self.stdout.write("Deleting APP (%s) in database" % app)
        self.cursor.execute("DELETE from django_migrations WHERE app = %s", [app])

    def delete_files_app(self, app):
        self.stdout.write("Deleting APP (%s) migrations files" % app)
        migrations_dir = os.path.join(app, 'migrations')
        if os.path.exists(migrations_dir):
            shutil.rmtree(os.path.join(app, 'migrations'))

    def delete_dependence_app(self, app):
        self.stdout.write("Deleting dependences in migrations for (%s)" % app)
        for root, dirs, files in os.walk(".", topdown=False):
            for name in dirs:
                if name == 'migrations':
                    migration_dir = os.path.join(root, name)
                    for r, d, f in os.walk(migration_dir):
                        for n in f:
                            file_name = os.path.join(r, n)
                            if '.pyc' in file_name:
                                continue
                            if '.py' in file_name:
                                regex = r'\(\'%s\'' % app
                                delete_line(file_name, regex, self.stdout)

    def handle(self, *args, **options):
        apps = options['apps']
        self.stdout.write("Reseting APP %s" % apps)
        for app in apps:
            self.delete_database_app(app)
            if not options['cached']:
                self.delete_files_app(app)
                self.delete_dependence_app(app)
            self.stdout.write("APP (%s) deleted with success" % app)

        if not options['cached']:
            call_command('makemigrations', *apps)

        for app in apps:
            call_command('migrate', app, '--fake')

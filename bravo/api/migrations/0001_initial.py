from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Moedas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('simbolo', models.CharField(max_length=5)),
                ('nome', models.CharField(max_length=255)),
                ('cotacao', models.DecimalField(decimal_places=2, max_digits=10)),
                ('ultima_atualizacao', models.DateTimeField(null=True, blank=True)),
            ],
        ),
    ]

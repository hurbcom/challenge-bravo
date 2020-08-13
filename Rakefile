namespace :db do
  require "sequel"
  require 'sequel/extensions/seed'
  require 'sequel/extensions/migration'
  require 'require_all'
  require 'dotenv'

  Dotenv.load

  Sequel.extension :migration, :seed

  begin
    DB = Sequel.connect(ENV['DATABASE_URL'])
  rescue
    DB = nil
  end

  desc "create database"
  task :create do
    puts("creating database")
    %x( createdb -E UTF8 -T template1 -U postgres --password -h localhost hurb_currency_converter )
    puts("successfully created database")
  end

  desc "Prints current schema version"
  task :version do
    version = if DB.tables.include?(:schema_info)
      DB[:schema_info].first[:version]
    end || 0

    puts "Schema Version: #{version}"
  end

  desc "Perform migration up to latest migration available"
  task :migrate do
    Sequel::Migrator.run(DB, "db/migrate")
    Rake::Task['db:version'].execute
  end

  desc "Perform rollback to specified target or full rollback as default"
  task :rollback do
    Sequel::Migrator.run(DB, "db/migrate")
    Rake::Task['db:version'].execute
  end

  desc "Perform migration reset (full rollback and migration)"
  task :reset do
    Sequel::Migrator.run(DB, "db/migrate", :target => 0)
    Sequel::Migrator.run(DB, "db/migrate")
    Rake::Task['db:version'].execute
  end

  desc "Seeds the database"
  task :seed do
    require_all "models"
    Sequel::Seeder.apply(DB, "db/seeds/")
    Rake::Task['db:version'].execute
  end
end
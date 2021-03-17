from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Moedas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('simbolo', models.CharField(max_length=15, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Cotacao',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ultima_atualizacao', models.DateField(blank=True, null=True)),
                ('cotacao', models.DecimalField(decimal_places=2, max_digits=10)),
                ('moeda_de', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moeda_de', to='api.moedas')),
                ('moeda_para', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moeda_para', to='api.moedas')),
            ],
        ),
    ]

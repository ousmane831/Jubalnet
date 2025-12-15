# Generated migration for adding new departments

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='authority',
            name='department',
            field=models.CharField(
                choices=[
                    ('police', 'Police'),
                    ('gendarmerie', 'Gendarmerie'),
                    ('justice', 'Justice'),
                    ('customs', 'Douanes'),
                    ('cybercrime', 'Cybercriminalité'),
                    ('anticorruption', 'Anti-corruption'),
                    ('health', 'Ministère de la santé et de l\'hygiène publique'),
                    ('customs_authority', 'Autorité des douanes'),
                ],
                max_length=20
            ),
        ),
    ]

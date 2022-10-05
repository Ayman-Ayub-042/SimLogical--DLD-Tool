from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Users list',
            fields=[
                ('firstname', models.CharField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lastname', models.CharField(max_length=1000)),
                ('email', models.CharField(null=True)),
                ('password', models.CharField(default=django.utils.timezone.now)),
                ('confirm_password', models.CharField(default=django.utils.timezone.now)),
            ],
        ),
    ]
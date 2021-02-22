# Generated by Django 3.1.6 on 2021-02-20 16:53

import api.models.signupRequest
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Signup_Request',
            fields=[
                ('username', models.CharField(error_messages={'unique': 'The username is already requested by other applier.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, primary_key=True, serialize=False, unique=True, validators=[api.models.signupRequest.validate_username_nonexist_in_author], verbose_name='username')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('git_url', models.URLField(default='http://github.com/', max_length=500)),
            ],
        ),
    ]

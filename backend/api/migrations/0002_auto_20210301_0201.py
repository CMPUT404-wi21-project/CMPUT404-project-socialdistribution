# Generated by Django 3.1.6 on 2021-03-01 02:01

import api.models.signupRequest
import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('host_url', models.URLField(max_length=500)),
                ('auth_username', models.CharField(max_length=200)),
                ('auth_password', models.CharField(max_length=200)),
                ('date_added', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Signup_Request',
            fields=[
                ('displayName', models.CharField(blank=True, max_length=150)),
                ('username', models.CharField(error_messages={'unique': 'The username is already requested by other applier.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, primary_key=True, serialize=False, unique=True, validators=[api.models.signupRequest.validate_username_nonexist_in_author], verbose_name='username')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('github', models.URLField(default='http://github.com/', max_length=500)),
                ('host', models.URLField(max_length=500)),
            ],
        ),
        migrations.RenameField(
            model_name='author',
            old_name='git_url',
            new_name='github',
        ),
        migrations.RemoveField(
            model_name='author',
            name='token',
        ),
        migrations.AddField(
            model_name='author',
            name='displayName',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='post',
            name='categories',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None),
        ),
    ]

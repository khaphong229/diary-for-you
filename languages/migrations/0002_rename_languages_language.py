# Generated by Django 5.0.6 on 2024-05-27 03:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('languages', '0001_initial'),
        ('translations', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Languages',
            new_name='Language',
        ),
    ]
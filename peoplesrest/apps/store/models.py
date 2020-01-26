from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from hashlib import md5
from os import path as op
from time import time


def upload_to(instance, filename, prefix=None, unique=False):
    """ Auto generate name for File and Image fields.
    """
    ext = op.splitext(filename)[1]
    name = str(instance.pk or '') + filename + (str(time()) if unique else '')

    # We think that we use utf8 based OS file system
    filename = md5(name.encode('utf8')).hexdigest() + ext
    basedir = op.join(instance._meta.app_label, instance._meta.object_name.lower())
    if prefix:
        basedir = op.join(basedir, prefix)
    return op.join('images', basedir, filename[:2], filename[2:4], filename)


class Category(MPTTModel):
    name = models.CharField('Название категории', max_length=50, unique=True)
    description = models.TextField('Описание категории')
    photo = models.ImageField(upload_to=upload_to, blank=True, verbose_name='Фотография категории')
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категорию'
        verbose_name_plural = 'Категории'


class Food(models.Model):
    name = models.CharField('Название блюда', max_length=50, unique=True)
    description = models.TextField('Описание блюда')
    price = models.IntegerField('Цена блюда')
    photo = models.ImageField(upload_to=upload_to, blank=True, verbose_name='Фотография блюда')
    weight = models.IntegerField('Вес блюда')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Блюдо'
        verbose_name_plural = 'Блюда'

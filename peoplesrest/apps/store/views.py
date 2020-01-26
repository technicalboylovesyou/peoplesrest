from django.http import Http404
from django.shortcuts import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from peoplesrest.apps.store.smsc_api import *

from peoplesrest.apps.store.models import Category, Food


def index(request):
    temp_list = Category.objects.all()
    category_list = []
    for element in temp_list:
        if element.is_child_node() == False:
            category_list.append(element)
    return render(request, 'store/list.html', {'category_list': category_list})


def category(request, category_id):
    try:
        sub_category = Category.objects.filter(parent=category_id)
        foods = Food.objects.filter(category=category_id)
        this_category = Category.objects.get(id=category_id)
        category_name = this_category.name.upper()
        parent = this_category.parent
    except:
        raise Http404("Подкатегории и блюда не найдены!")

    return render(request, 'store/sub_list.html',
                  {'sub_category': sub_category, 'foods': foods, 'category_name': category_name, 'parent': parent})


def food(request, food_id):
    try:
        food_info = Food.objects.get(id=food_id)
    except:
        raise Http404("Даннные о блюде не найдены!")

    return render(request, 'store/details.html', {'food_info': food_info})


def cart(request):
    return render(request, 'store/cart.html')


def purchase(request):
    return render(request, 'store/purchase.html')


def success(request):
    return render(request, 'store/success.html')


@csrf_exempt
def send_sms(request):
    smsc = SMSC()
    cart = request.body.decode('utf-8')
    data = json.loads(cart)['cart']
    name = data['name']
    address = data['address']
    phone = data['phone']

    msg = name + "\n" + address + "\n" + phone + "\nЗаказ:\n"
    for food in data['cart']:
        msg += food['name'] + " " + str(food['count']) + " шт.\n"
    r = smsc.send_sms("79141433343", msg, sender="sms")
    return HttpResponse(1)

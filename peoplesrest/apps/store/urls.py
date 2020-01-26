from django.urls import path

from . import views

app_name = 'store'

urlpatterns = [
    path('', views.index, name='index'),
    path('category/<int:category_id>/', views.category, name='category'),
    path('food/<int:food_id>/', views.food, name='food'),
    path('cart/', views.cart, name='cart'),
    path('purchase/', views.purchase, name='purchase'),
    path('success/', views.success, name='success'),
    path('send_sms/', views.send_sms, name='send_sms'),
]

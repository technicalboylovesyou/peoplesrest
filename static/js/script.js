function add(name, price, id, photo) {
    let food = {
        name: name,
        price: price,
        id: id,
        photo:photo,
        count: 1
    };

    if ($.cookie('cart')!=null) {
        let cart = JSON.parse($.cookie('cart'));
        let check = true;
        for (let i = 0;i<cart.length;i++) {
            if (cart[i]['name'] == name) {
                cart[i]['count'] ++;
                check = false;
                break;
            }
        }
        if (check) {
            cart.push(food);
        }
        $.cookie('cart', JSON.stringify(cart), { expires: 7, path: '/'});
        $("#cart_count").text(parseInt($("#cart_count").text())+1);

    } else {
        $.cookie('cart', JSON.stringify([food]), { expires: 7, path: '/'});
        $("#cart_count").show();
        $("#cart_count").text(1);
    }
    $('#btn-cart').text('ДОБАВЛЕНО');
    $("#btn-cart").attr("onclick", "del('" + name + "')");
}

function del (name) {
    if ($.cookie('cart')!=null) {
        let cart = JSON.parse($.cookie('cart'));
        for (let i = 0;i<cart.length;i++) {
            if (cart[i]['name'] === name) {
                let price = cart[i]['price'];
                let id = cart[i]['id'];
                let photo = cart[i]['photo'];
                let count = parseInt(cart[i]['count']);
                cart.splice(i, 1);
                if (cart.length!==0) {
                    $.cookie('cart', JSON.stringify(cart), { expires: 7, path: '/'});
                    $("#cart_count").text(parseInt($("#cart_count").text())-count);
                } else {
                    $.removeCookie('cart', { path: '/' });
                    $("#cart_count").hide();
                }
                $('#btn-cart').text('В КОРЗИНУ');
                $("#btn-cart").attr("onclick", "add('" + name + "', " + price + ", " + id +",'" + photo + "')");
                break;
            }
        }
    }
}

function del_cart(id){
    if ($.cookie('cart')!=null) {
        let cart = JSON.parse($.cookie('cart'));
        for (let i = 0;i<cart.length;i++) {
            if (cart[i]['id'] === id) {
                cart.splice(i, 1);
                if (cart.length!==0) {
                    $.cookie('cart', JSON.stringify(cart), { expires: 7, path: '/'});
                    $("#cart_count").text(parseInt($("#cart_count").text())-1);
                } else {
                    $.removeCookie('cart', { path: '/' });
                    $("#cart_count").hide();
                    $('#card').append('<h3 id = "food_name" style="color: whitesmoke; margin-bottom: 25px;  text-align: center;" class="jumbotron-heading">Корзина пуста</h3><hr id="hr_` + cart[i][\'id\'] + `" style="border-color: grey">')

                }
                $("#cart_"+id).hide();
                $("#hr_"+id).hide();
                $("#all_sum").text(parseInt($("#all_sum").text()) - parseInt($("#sum_"+id).text()));
            }
        }
    }
}

function edit_count(select_id, count) {
    let all_sum = 0;
    let all_count = 0;
    if ($.cookie('cart')!=null) {
        let cart = JSON.parse($.cookie('cart'));
        for (let i = 0;i<cart.length;i++) {
            if (parseInt(cart[i]['id']) === parseInt(select_id)) {
                cart[i]['count'] = count;
                $.cookie('cart', JSON.stringify(cart), { expires: 7, path: '/'});
                $('#sum_'+select_id).text(parseInt(cart[i]['price']) * parseInt(cart[i]['count']));
                $('#sum_calc_'+select_id).text(parseInt(cart[i]['price']) * parseInt(cart[i]['count']));
                $('#count_'+select_id).text(count);
            }
            all_sum += parseInt(cart[i]['price']) * parseInt(cart[i]['count']);
            all_count += parseInt(cart[i]['count']);
        }
        $("#all_sum").text(all_sum);
        $("#cart_count").text(all_count);
    }
}

function purchase() {
    if ($.cookie('cart')!=null) {
        let cart = JSON.parse($.cookie('cart'));
        let name = $('#name').val();
        let address = $('#address').val();
        let phone = $('#phone').val();
        if (name === "" || address === "" || phone === "") {
            if (name === "") {
                $('#name').addClass("error-input");
            }
            if (address === "") {
                $('#address').addClass("error-input");
            }
            if (phone === "") {
                $('#phone').addClass("error-input");
            }
        } else {
            let order = {
                name: name,
                address: address,
                phone: phone,
                cart: cart
            };
            $.ajax({
                type: 'POST',
                url: "/store/send_sms/",
                data: JSON.stringify({"cart": order}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    $.removeCookie('cart', {path: '/'});
                    $("#cart_count").hide();
                    window.location.href = '/store/success';
                }
            });
        }
    }
}

$(document).ready(function () {
    let url = location.href;
    let regV = /food/gi;     // шаблон
    let result = url.match(regV);
    if (result) {
        let food_name = $('#food_name').text();
        if ($.cookie('cart') != null) {
            let cart = JSON.parse($.cookie('cart'));
            for (let i = 0; i < cart.length; i++) {
                if (cart[i]['name'].toUpperCase() === food_name.toUpperCase()) {
                    $('#btn-cart').text('ДОБАВЛЕНО');
                    $("#btn-cart").attr("onclick", "del('" + cart[i]['name'] + "')");
                    break;
                }
            }
        }
    }
    let count = 0;
    if ($.cookie('cart') != null) {
        let cart = JSON.parse($.cookie('cart'));
        for (let i = 0; i < cart.length; i++) {
            count += parseInt(cart[i]['count']);
        }
    }
    if (count > 0) {
        $("#cart_count").show();
        $("#cart_count").text(count);
    }

    url = location.href;
    regV = /cart/gi;     // шаблон
    result = url.match(regV);
    if (result) {
        let all_sum = 0
        if ($.cookie('cart') != null) {
            let cart = JSON.parse($.cookie('cart'));
            for (let i = 0; i < cart.length; i++) {
                all_sum += parseInt(cart[i]['count']) * parseInt(cart[i]['price'])
                let str = `<div id="cart_` + cart[i]['id'] + `" class="media">
        <a href="/store/food/` + cart[i]['id'] + `"><img class="img16x9_cart" width="150" src="` + cart[i]['photo'] + `" class="mr-3" alt="..."></a>
        <div style="color: white" class="media-body">
            <a href="/store/food/` + cart[i]['id'] + `/"><h5 class="mt-0">` + cart[i]['name'] + `</h5></a>
            <div>
                <select id="select_` + cart[i]['id'] + `" style="float: left; cursor: pointer;" name="` + cart[i]['id'] + `" class="select_cart custom-select my-1 mr-sm-2">`;
                for (let j = 1; j < 10; j++) {
                    if (j === parseInt(cart[i]['count'])) {
                        str += `<option value="` + j + `" selected>` + j + `</option>`
                    } else {
                        str += `<option value="` + j + `">` + j + `</option>`
                    }
                }
                str += `</select>
                <div onclick="del_cart(` + cart[i]['id'] + `)" class="btn-custom" style="float: left; margin-left: 10px; margin-top: 10px;">Удалить</div>
            </div>
        </div>
        <div style="color: rgba(255,255,255,0.5); text-align: right; margin-top: 18px;">
        <h3 class="mt-0" style="margin-bottom: 0px; text-align: right; color: white"><span id="sum_` + cart[i]['id'] + `">` + parseInt(cart[i]['count']) * parseInt(cart[i]['price']) + `</span>&#8381;</h3>
        <span id="count_` + cart[i]['id'] + `">` + cart[i]['count'] + `</span>x` + cart[i]['price'] + `=<span id="sum_calc_` + cart[i]['id'] + `">` + parseInt(cart[i]['count']) * parseInt(cart[i]['price']) + `</span>&#8381;
        </div>
    </div><hr id="hr_` + cart[i]['id'] + `" style="border-color: grey">`;
                $('#card').append(str)
            }
        } else {
            $('#card').append('<h3 id = "food_name" style="color: whitesmoke; margin-bottom: 25px;  text-align: center;" class="jumbotron-heading">Корзина пуста</h3><hr id="hr_` + cart[i][\'id\'] + `" style="border-color: grey">')
        }

        $('#all_sum').text(all_sum);
        // language=HTML
        $('.select_cart').change(function () {
            let select_id = $(this).attr('name');
            let count = $(this).val();
            edit_count(select_id, count);
        })
    }

    url = location.href;
    regV = /purchase/gi;     // шаблон
    result = url.match(regV);
    result = url.match(regV);
    if (result) {
        if ($.cookie('cart') != null) {
            let all_sum = 0
            let cart = JSON.parse($.cookie('cart'));
            for (let i = 0; i < cart.length; i++) {
                all_sum += parseInt(cart[i]['count']) * parseInt(cart[i]['price'])
            }
            $('#all_sum').text(all_sum);
        }
    }

    $('#name').change(function () {
        $('#name').removeClass("error-input");
    });

    $('#address').change(function () {
        $('#address').removeClass("error-input");
    });

    $('#phone').change(function () {
        $('#phone').removeClass("error-input");
    });

    $("#phone").mask("+7 (999) 999-99-99");

});
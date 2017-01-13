
var showDriver = new Framework7({
    swipePanel: 'left',
    material:true,
    cache:false,
    onAjaxStart: function (xhr) {
        showDriver.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        showDriver.hideIndicator();
    },
    modalTitle:'Сообщение'
});

var sslProtokol = 'http://';

var $$ = Dom7;

$$(document).on('click', 'i.open-side-panel', function(){
    showDriver.openPanel('left');
});

var mainView = showDriver.addView('.view-main');
var panelView = showDriver.addView('.panel-view');

function loadContent(){
    var tokenUser = window.localStorage.getItem('token');
    mainView.loadPage('http://showdriver.ru/api/home/'+tokenUser);
}

function loadPanel(){
    var tokenUser = window.localStorage.getItem('token');
    panelView.loadPage('http://showdriver.ru/api/panel/'+tokenUser);
}

loadPanel();
loadContent();

showDriver.openPanel('left');


$$(document).on('pageInit', function (e) {

    var page = e.detail.page;

    if(page.name == 'auth'){

            $(document).find('.auth-block input.auth-user-phone').mask('+70000000000');

            $(document).off('click', '.auth-block input.button-auth-user').on('click', '.auth-block input.button-auth-user', function(e){
                e.preventDefault();

                var inputsUser = $(document).find('input.auth-inputs').length;
                var o = 0;

                var phoneUser = $(document).find('.auth-block input.auth-user-phone').val();
                var passwordUser = $(document).find('.auth-block input.auth-user-password').val();

                if(phoneUser != '' && passwordUser != ''){

                    $(document).find('input.auth-inputs').css('border','1px solid rgb(236, 208, 120)');
                    $(document).find('i.auth-input-error').stop().animate({'opacity':0});

                    $.ajax({
                        url:'http://showdriver.ru/api/auth/'+phoneUser+'/'+passwordUser,
                        type:'GET',
                        success:function(token){

                            if(token == 'error_1'){
                                showDriver.alert('Ошибка аутентификации! Логин или пароль не подходит.');
                            }else if(token == 'error_2'){
                                showDriver.alert('Данный аккаунт не активирован!');
                            }else if(token == 'error_3'){
                                showDriver.alert('Аккаунт не найден');
                            }else{
                                var token = JSON.parse(token);
                                if(token.user_api_token.length > 40){
                                    window.localStorage.setItem('token',token.user_api_token);
                                    loadPanel();
                                    loadContent();
                                }
                            }
                        }
                    });

                }else{

                    for(o; o < inputsUser; o++){

                        var inputClear = $(document).find('input.auth-inputs').eq(o).val();

                        if(inputClear != ''){
                            $(document).find('input.auth-inputs').eq(o).css('border','1px solid rgb(236, 208, 120)');
                            $(document).find('i.auth-input-error').eq(o).stop().animate({'opacity':0});
                        }else{
                            $(document).find('input.auth-inputs').eq(o).css('border','1px solid rgb(236, 120, 120)');
                            $(document).find('i.auth-input-error').eq(o).stop().animate({'opacity':1});
                        }

                    }

                }

            });

    }else if(page.name == 'search-clients'){

        var tokenUser = window.localStorage.getItem('token');

        $(document).find('select.region-main').change(function(){
            var region = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-city/'+region+'/'+tokenUser,
                type:'get',
                success:function(cities){
                    $$(document).find('select.city-main').html('');
                    $$(document).find('select.city-main').css('display','block');
                    var cities = JSON.parse(cities);
                    var t = 0;
                    for(t; t < cities.length; t++){
                        $$(document).find('select.city-main').append('<option value="'+cities[t].id+'">'+cities[t].city_name+'</option>');
                    }
                }
            });
        });

        $(document).find('select.main-cat-service').change(function(){
            var idservice = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-services/'+idservice+'/'+tokenUser,
                type:'get',
                success:function(services){
                    $$(document).find('select.main-list-services').css('display','block');
                    var y = 0;
                    var services = JSON.parse(services);
                    $$(document).find('select.main-list-services').html('');
                    if(idservice == 1){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].service_id+'">'+services[y].service_name+'</option>');
                        }
                    }else if(idservice == 2){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].decor_id+'">'+services[y].decor_name+'</option>');
                        }
                    }else if(idservice == 3){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].arenda_id+'">'+services[y].arenda_name+'</option>');
                        }
                    }else if(idservice == 4){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].service_home_id+'">'+services[y].service_home_name+'</option>');
                        }
                    }else if(idservice == 5){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].organization_id+'">'+services[y].organization_name+'</option>');
                        }
                    }
                }
            });
        });

        function loadOrdersMain(){

            var cityIdzakaz = 0;
            var serviceIdzakaz = 0;
            var catidzakaz = 0;
            var gonorarPrice = 0;
            $(document).find('.result-search-block-load').css('visibility','visible');

                $(document).find('.search-page').css('display','none');
                $(document).find('.result-search-block').css('display','block');

                $.ajax({
                    url:'http://showdriver.ru/api/search-clients/'+cityIdzakaz+'/'+serviceIdzakaz+'/'+catidzakaz+'/'+gonorarPrice+'/'+tokenUser,
                    type:'get',
                    success:function(clients){

                        $(document).find('.main-clients-list-block ul').html('');
                        var clients = JSON.parse(clients);
                        $(document).find('.result-search-block-load').css('visibility','hidden');

                        if(clients.length > 0){

                            $(document).find('.main-clients-list-block').css('visibility','visible');

                            var u = 0;
                            
                            for(u; u < clients.length; u++){
                                var img = clients[u].public_order_user_avatar === 'default.jpg' ? 'default.jpg' : clients[u].public_order_user_avatar;
                                $(document).find('.main-clients-list-block ul').append('<li>'+
                            '<div class="row">'+
                                '<div class="col-20">'+
                                    '<div class="img-block-user" style="background:url(http://showdriver.ru/media/avatars/'+img+') center;background-size:cover;"></div>'+
                                '</div>'+
                                '<div class="col-70">'+
                                    '<h1>'+clients[u].public_order_service_name_text+'</h1>'+
                                    '<p>город: '+clients[u].public_order_cuty_text_name+'</p>'+
                                    '<strong>гонорар: '+clients[u].public_order_price+' руб.</strong>'+
                                    '<strong>дата проведения: '+clients[u].public_order_start_date+'</strong>'+
                                '</div>'+
                                '<div class="col-10">'+
                                    '<i class="fa fa-star liked-icon-add" data-likes-client="'+clients[u].public_order_user_id+'" aria-hidden="true"></i>'+
                                    '<a class="client-call-link external" href="tel:+7'+clients[u].public_order_user_phone+'"><i class="fa fa-phone phone-icon-call" aria-hidden="true"></i></a>'+
                                '</div>'+
                            '</div>'+
                        '</li>');
                            }

                        }else{
                            $(document).find('.not-found-block').css('visibility','visible');
                        }

                    }
                });     
        }

        loadOrdersMain();

        $(document).off('click', 'input.submit-user-zakaz').on('click', 'input.submit-user-zakaz', function(){
            var cityIdzakaz = $$(document).find('select.city-main').val();
            var serviceIdzakaz = $$(document).find('select.main-list-services').val();
            var catidzakaz = $$(document).find('select.main-cat-service').val();
            var gonorarPrice = $$(document).find('input.user-gonorar-zakaz').val();
            $(document).find('.result-search-block-load').css('visibility','visible');

            if(cityIdzakaz != '' && serviceIdzakaz != '' && gonorarPrice != ''){

                $(document).find('.search-page').css('display','none');
                $(document).find('.result-search-block').css('display','block');

                $.ajax({
                    url:'http://showdriver.ru/api/search-clients/'+cityIdzakaz+'/'+serviceIdzakaz+'/'+catidzakaz+'/'+gonorarPrice+'/'+tokenUser,
                    type:'get',
                    success:function(clients){

                        $(document).find('.main-clients-list-block ul').html('');
                        var clients = JSON.parse(clients);
                        $(document).find('.result-search-block-load').css('visibility','hidden');

                        if(clients.length > 0){

                            $(document).find('.main-clients-list-block').css('visibility','visible');

                            var u = 0;
                            
                            for(u; u < clients.length; u++){
                                var img = clients[u].public_order_user_avatar === 'default.jpg' ? 'default.jpg' : clients[u].public_order_user_avatar;
                                $(document).find('.main-clients-list-block ul').append('<li>'+
                            '<div class="row">'+
                                '<div class="col-20">'+
                                    '<div class="img-block-user" style="background:url(http://showdriver.ru/media/avatars/'+img+') center;background-size:cover;"></div>'+
                                '</div>'+
                                '<div class="col-70">'+
                                    '<h1>'+clients[u].public_order_service_name_text+'</h1>'+
                                    '<p>город: '+clients[u].public_order_cuty_text_name+'</p>'+
                                    '<strong>гонорар: '+clients[u].public_order_price+' руб.</strong>'+
                                    '<strong>дата проведения: '+clients[u].public_order_start_date+'</strong>'+
                                '</div>'+
                                '<div class="col-10">'+
                                    '<i class="fa fa-star liked-icon-add" data-likes-client="'+clients[u].public_order_user_id+'" aria-hidden="true"></i>'+
                                    '<a class="client-call-link external" href="tel:+7'+clients[u].public_order_user_phone+'"><i class="fa fa-phone phone-icon-call" aria-hidden="true"></i></a>'+
                                '</div>'+
                            '</div>'+
                        '</li>');
                            }

                        }else{
                            $(document).find('.result-search-block-load').css('visibility','hidden');
                            $(document).find('.not-found-block').css('visibility','visible');
                        }

                    }
                });

            }else{
                $(document).find('.result-search-block-load').css('visibility','hidden');
                showDriver.alert('Заполните поля');
            }

        });

        $(document).off('click', 'span.button-search-block').on('click', 'span.button-search-block', function(){
            $(document).find('.not-found-block').css('visibility','hidden');
            $(document).find('.search-page').css('display','block');
        });

        $(document).off('click', 'span.button-search-block-list').on('click', 'span.button-search-block-list', function(){
            $(document).find('.main-clients-list-block').css('visibility','hidden');
            $(document).find('.search-page').css('display','block');
        });

        $(document).off('click', 'i.liked-icon-add').on('click', 'i.liked-icon-add', function(){

            var cityIdzakaz = $$(document).find('select.city-main').val();
            var cityIdzakazText = $$(document).find('select.city-main option[value="'+cityIdzakaz+'"]').text();

            var idclient = $(this).attr('data-likes-client');
            
            $.ajax({
                url:'http://showdriver.ru/api/save-liked-client/'+idclient+'/'+cityIdzakazText+'/'+tokenUser,
                type:'get',
                success:function(info){
                    if(info == 'ok'){
                        showDriver.alert('Добавлен новый контакт');
                    }else if(info == 'copy'){
                        showDriver.alert('Контакт уже записан');
                    }else{
                        showDriver.alert('Произошла ошибка, попробуйте еще раз');
                    }
                }
            });

        }); 


    }else if(page.name == 'search-ispolnitel'){

        var tokenUser = window.localStorage.getItem('token');

        $(document).find('select.region-main').change(function(){
            var region = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-city/'+region+'/'+tokenUser,
                type:'get',
                success:function(cities){
                    $$(document).find('select.city-main').html('');
                    $$(document).find('select.city-main').css('display','block');
                    var cities = JSON.parse(cities);
                    var t = 0;
                    for(t; t < cities.length; t++){
                        $$(document).find('select.city-main').append('<option value="'+cities[t].id+'">'+cities[t].city_name+'</option>');
                    }
                }
            });
        });

        $(document).find('select.main-cat-service').change(function(){
            var idservice = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-services/'+idservice+'/'+tokenUser,
                type:'get',
                success:function(services){
                    $$(document).find('select.main-list-services').css('display','block');
                    var y = 0;
                    var services = JSON.parse(services);
                    $$(document).find('select.main-list-services').html('');
                    if(idservice == 1){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].service_id+'">'+services[y].service_name+'</option>');
                        }
                    }else if(idservice == 2){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].decor_id+'">'+services[y].decor_name+'</option>');
                        }
                    }else if(idservice == 3){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].arenda_id+'">'+services[y].arenda_name+'</option>');
                        }
                    }else if(idservice == 4){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].service_home_id+'">'+services[y].service_home_name+'</option>');
                        }
                    }else if(idservice == 5){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].organization_id+'">'+services[y].organization_name+'</option>');
                        }
                    }
                }
            });
        });


        $(document).off('click', 'input.submit-user-zakaz').on('click', 'input.submit-user-zakaz', function(){
            var cityIdzakaz = $$(document).find('select.city-main').val();
            var serviceIdzakaz = $$(document).find('select.main-list-services').val();
            var catidzakaz = $$(document).find('select.main-cat-service').val();
            var gonorarPrice = $$(document).find('input.user-gonorar-zakaz').val();
            $(document).find('.result-search-block-load').css('visibility','visible');

            var cityIdzakazText = $$(document).find('select.city-main option[value="'+cityIdzakaz+'"]').text();
            var serviceIdzakazText = $$(document).find('select.main-list-services option[value="'+serviceIdzakaz+'"]').text();
            var catidzakazText = $$(document).find('select.main-cat-service option[value="'+catidzakaz+'"]').text(); 

            $(document).find('b.city-service-text').html(cityIdzakazText);
            $(document).find('b.name-service-text').html(serviceIdzakazText);
            $(document).find('b.cat-service-text').html(catidzakazText);

            if(cityIdzakaz != '' && serviceIdzakaz != '' && gonorarPrice != ''){

                $(document).find('.search-page').css('display','none');
                $(document).find('.result-search-block').css('display','block');

                $.ajax({
                    url:'http://showdriver.ru/api/search-ispolnitel/'+cityIdzakaz+'/'+serviceIdzakaz+'/'+catidzakaz+'/'+gonorarPrice,
                    type:'get',
                    success:function(clients){

                        $(document).find('.main-clients-list-block ul').html('');
                        var clients = JSON.parse(clients);
                        $(document).find('.result-search-block-load').css('visibility','hidden');

                        if(clients.length > 0){

                            $(document).find('.main-clients-list-block').css('visibility','visible');

                            var u = 0;
                            
                            for(u; u < clients.length; u++){
                                var img = clients[u].user_avatar_src === 'default.jpg' ? 'default.jpg' : clients[u].user_avatar_src;
                                $(document).find('.main-clients-list-block ul').append('<li>'+
                            '<div class="row">'+
                                '<div class="col-20">'+
                                    '<div class="img-block-user" style="background:url(http://showdriver.ru/media/avatars/'+img+') center;background-size:cover;"></div>'+
                                '</div>'+
                                '<div class="col-70">'+
                                    '<h1>'+clients[u].user_name+' '+clients[u].user_lastname+'</h1>'+
                                    '<p>город: '+cityIdzakazText+'</p>'+
                                '</div>'+
                                '<div class="col-10">'+
                                    '<i class="fa fa-star liked-icon-add" data-likes-client="'+clients[u].public_order_user_id+'" aria-hidden="true"></i>'+
                                    '<a class="client-call-link external" href="tel:+7'+clients[u].phone_user+'"><i class="fa fa-phone phone-icon-call" aria-hidden="true"></i></a>'+
                                '</div>'+
                            '</div>'+
                        '</li>');
                            }

                        }else{
                            $(document).find('.not-found-block').css('visibility','visible');
                        }

                    }
                });

            }else{
                showDriver.alert('Заполните поля');
            }

        });


        $(document).off('click', 'i.liked-icon-add').on('click', 'i.liked-icon-add', function(){

            var cityIdzakaz = $$(document).find('select.city-main').val();
            var cityIdzakazText = $$(document).find('select.city-main option[value="'+cityIdzakaz+'"]').text();

            var idclient = $(this).attr('data-likes-client');
            
            $.ajax({
                url:'http://showdriver.ru/api/save-liked-client/'+idclient+'/'+cityIdzakazText+'/'+tokenUser,
                type:'get',
                success:function(info){
                    if(info == 'ok'){
                        showDriver.alert('Добавлен новый контакт');
                    }else if(info == 'copy'){
                        showDriver.alert('Контакт уже записан');
                    }else{
                        showDriver.alert('Произошла ошибка, попробуйте еще раз');
                    }
                }
            });

        });  

        //save orders liked

        /*$(document).off('click', 'i.liked-icon-add').on('click', 'i.liked-icon-add', function(){

            var idOrder = $(this).attr('data-likes-client');
            
            $.ajax({
                url:'http://showdriver.ru/api/save-liked/'+idOrder+'/'+tokenUser,
                type:'get',
                success:function(info){
                    if(info == 'ok'){
                        showDriver.alert('Добавлен новый контакт');
                    }else if(info == 'copy'){
                        showDriver.alert('Этот контакт уже записан');
                    }else{
                        showDriver.alert('Произошла ошибка, попробуйте еще раз');
                    }
                }
            });

        });*/

        $(document).off('click', 'span.button-search-block').on('click', 'span.button-search-block', function(){
            $(document).find('.not-found-block').css('visibility','hidden');
            $(document).find('.search-page').css('display','block');
        });

        $(document).off('click', 'span.button-search-block-list').on('click', 'span.button-search-block-list', function(){
            $(document).find('.main-clients-list-block').css('visibility','hidden');
            $(document).find('.search-page').css('display','block');
        });

    }else if(page.name == 'messages'){

        var tokenUser = window.localStorage.getItem('token');
        var linksAll = $(document).find('.user-list a');
        var j = 0;

        for(j; j < linksAll.length; j++){
            var linkmain = $(document).find('.user-list a').eq(j).attr('href');
            $(document).find('.user-list a').eq(j).attr('href',linkmain+'/'+tokenUser);
        }


    }else if(page.name === 'rooms'){

        var token = window.localStorage.getItem('token');
        var idRoom = $(document).find('div.messages-content').attr('data-room-id');
        var userIdmain = $(document).find('div.messages-content').attr('data-user-id');

        var myMessages = showDriver.messages('.messages', {
          autoLayout:true
        });
        
        // Init Messagebar
        showDriver.messagebar('.messagebar');
        var myphoneData = $(document).find('div.messages-content').attr('data-user-phone');

        myMessages.addMessage({
            text: 'Подключен '+myphoneData,
            type: 'sent',
        });

        var lastMessage = '';

        function mainUpdateMessagesServer(idRoom, token){
            $(document).find('.messages').html('');
            $.ajax({
                url:'http://showdriver.ru/api/messages/room/get-messages/'+idRoom+'/'+token,
                type:'get',
                success:function(messages){
                    //var messages = JSON.parse(messages);
                    var t = 0;
                    for(t; t < messages.length; t++){
                        if(Number(messages[t].user_message_one_id) === Number(userIdmain)){
                            myMessages.addMessage({
                                name: 'Вы',
                                id: messages[t].id,
                                type: 'sent',
                                text: messages[t].user_message_one_text
                            }, 'append'); 

                        }else{
                            myMessages.addMessage({
                                name: messages[t].user_message_one_phone,
                                type: 'received',
                                id: messages[t].id,
                                text: messages[t].user_message_one_text
                            }, 'append');
                        }
                        lastMessage = $(document).find('.message:last .message-text').text(); 

                    }
                }
            });
            console.log(1);
        }
        mainUpdateMessagesServer(idRoom, token);
    
        /*$(document).off('click', '.load-messages-user').on('click', '.load-messages-user', function(){
            mainUpdateMessagesServer(idRoom, token);
        });*/

            

        setInterval(function(){
            //$(document).find('.messages').html(''); 
            lastMessage = $(document).find('.message:last .message-text').text(); 
            $.ajax({
                url:'http://showdriver.ru/api/messages/room/get-messages-one/'+idRoom+'/'+token+'/'+lastMessage,
                type:'get',
                success:function(messages){
                    var messages = JSON.parse(messages);
                    console.log(messages);
                    var t = 0;
                    if(lastMessage != messages.user_message_one_text){
                        if(Number(messages.user_message_one_id) === Number(userIdmain)){
                            myMessages.addMessage({
                                name: 'Вы',
                                type: 'sent',
                                id:messages.id,
                                text: messages.user_message_one_text
                            }, 'append');    
                        }else{
                            myMessages.addMessage({
                                name: messages.user_message_one_phone,
                                type: 'received',
                                id:messages.id,
                                text: messages.user_message_one_text
                            }, 'append');         
                        }
                    }
                    lastMessage = $(document).find('.message:last .message-text').text(); 
                }
            });
        }, 800);

        //received
        //sent

        $(document).off('click', 'a.send-message').on('click', 'a.send-message', function(){
            var messageText = $(document).find('textarea.main-user-text').val();
            //alert(myphoneData);
            //alert(idRoom);
            if(messageText != ''){

                myMessages.addMessage({
                    text: messageText,
                    type: 'sent',
                    name: 'Вы'
                });

                $.ajax({
                    url:'http://showdriver.ru/api/messages/room/add-messages',
                    type:'post',
                    data:{
                        'token':token,
                        'idroom':idRoom,
                        'message':messageText
                    },
                    success:function(messages){
                        console.log('ok');
                    }
                });

                $(document).find('textarea.main-user-text').val('');

            }else{
                showDriver.alert('Пустое поле');
            }

        });

    }else if(page.name == 'home'){

        var tokenUser = window.localStorage.getItem('token');

        $(document).off('click', '.main-save-about').on('click', '.main-save-about', function(){

            var textAboutUser = $('textarea.main-user-about').val();

            $.ajax({
                url:'http://showdriver.ru/api/save-about-user/'+tokenUser,
                type:'get',
                data:{
                    about:textAboutUser
                },
                success:function(about){
                    if(about == 'ok'){
                        showDriver.alert('Информация обновлена');
                    }else{
                        showDriver.alert('Произошла ошибка, попробуйте еще раз.');
                    }
                }
            });

        });


        $(document).off('click', 'span.main-save-gonorar').on('click', 'span.main-save-gonorar', function(){
            var gonorar = $(document).find('input.user-input-gonorar').val();
            if(gonorar > 0 || gonorar != ''){
                $.ajax({
                    url:'http://showdriver.ru/api/settings-save-gonorar/'+tokenUser+'/'+gonorar,
                    type:'get',
                    success:function(gonorarServer){
                        if(gonorarServer == 'ok'){
                            $(document).find('.main-text-gonorar p').html(gonorar+' руб.');
                            showDriver.alert('Обновлено');
                        }else if(gonorarServer == 'no'){
                            showDriver.alert('Что-то пошло не так, попробуйте еще раз.');
                        }else{
                            showDriver.alert('Серверная ошибка, попробуйте позже.');
                        }
                    }
                });
            }else{
                showDriver.alert('Заполните поле');
            }
        });

        $(document).find('input.upload-user-photo').on('change',function(){
            $(document).find('h3.load-text-img').html('Загружаем картинку');
            var img = new FormData();
            img.append('img',this.files[0]);
            img.append('token',tokenUser);
            $.ajax({
                url: 'http://showdriver.ru/api/settings-save-photo',
                type:'post',
                contentType: false,
                processData: false,
                data: img,
                success: function (data) {
                    $(document).find('h3.load-text-img').html('');
                    if(data == 'error'){
                        showDriver.alert('Произошла ошибка на сервере, попробуйте позже.');
                    }else{
                        showDriver.alert('Сохранено');
                        $(document).find('.main-block-photo').css({
                            'background':'url(http://showdriver.ru/'+data+') center',
                            'backgroundSize':'cover'
                        });
                    }
                }
            });

        });

        $(document).find('select.main-regions').change(function(){
            var region = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-city/'+region+'/'+tokenUser,
                type:'get',
                success:function(cities){
                    $$(document).find('select.main-cities').html('');
                    var cities = JSON.parse(cities);
                    var t = 0;
                    for(t; t < cities.length; t++){
                        $$(document).find('select.main-cities').append('<option value="'+cities[t].id+'">'+cities[t].city_name+'</option>');
                    }
                }
            });
        }); 

        $(document).find('select.main-service-cats').change(function(){

            var idservice = $(this).val();

            if(idservice == 0 || idservice == ''){

                $(document).find('select.main-service-names').css('display','none').val('');

            }else{

                $.ajax({
                    url:'http://showdriver.ru/api/get-services/'+idservice+'/'+tokenUser,
                    type:'get',
                    success:function(services){
                        $(document).find('select.main-service-names').css('display','block');
                        var y = 0;
                        var services = JSON.parse(services);
                        $(document).find('select.main-service-names').html('');
                        if(idservice == 1){
                            for(y; y < services.length; y++){
                                $(document).find('select.main-service-names').append('<option value="'+services[y].service_id+'">'+services[y].service_name+'</option>');
                            }
                        }else if(idservice == 2){
                            for(y; y < services.length; y++){
                                $(document).find('select.main-service-names').append('<option value="'+services[y].decor_id+'">'+services[y].decor_name+'</option>');
                            }
                        }else if(idservice == 3){
                            for(y; y < services.length; y++){
                                $(document).find('select.main-service-names').append('<option value="'+services[y].arenda_id+'">'+services[y].arenda_name+'</option>');
                            }
                        }else if(idservice == 4){
                            for(y; y < services.length; y++){
                                $(document).find('select.main-service-names').append('<option value="'+services[y].service_home_id+'">'+services[y].service_home_name+'</option>');
                            }
                        }else if(idservice == 5){
                            for(y; y < services.length; y++){
                                $(document).find('select.main-service-names').append('<option value="'+services[y].organization_id+'">'+services[y].organization_name+'</option>');
                            }
                        }
                    }
                });

            }

        });

        $(document).off('click', '.main-save-services').on('click', '.main-save-services', function(){

            var catIdService = $(document).find('select.main-service-cats option:selected').val();
            var IdServiceName = $(document).find('select.main-service-names option:selected').val();

            $(document).find('.main-text-service').html('<p>'+$(document).find('select.main-service-cats option:selected').text()+' | '+$(document).find('select.main-service-names option:selected').text()+'</p>');

            if(catIdService != 0 && IdServiceName != 0){
                
                $.ajax({
                    url:'http://showdriver.ru/api/save-service-user/'+catIdService+'/'+IdServiceName+'/'+tokenUser,
                    type:'get',
                    success:function(service){
                        if(service == 'ok'){
                            showDriver.alert('Данные обновлены');
                        }
                    }
                });

            }else{
                showDriver.alert('Выберите услугу');
            }

        });

        $(document).off('click', '.main-save-city').on('click', '.main-save-city', function(){

            var regionId = $(document).find('select.main-regions option:selected').val();
            var cityId = $(document).find('select.main-cities option:selected').val();
            
            $.ajax({
                url:'http://showdriver.ru/api/save-city-user/'+regionId+'/'+cityId+'/'+tokenUser,
                type:'get',
                success:function(city){
                    if(city == 'ok'){
                        showDriver.alert('Город сохранен');
                    }else{
                        showDriver.alert('Произошла ошибка, попробуйте еще раз');
                    }
                }
            });


        });

        $(document).off('click', '.user-status-button').on('click', '.user-status-button', function(){

            var statusbutton;
            var checkStatus = $$(this).find('input.checkstatus-user').prop('checked');
            if(checkStatus == true){
              statusbutton = 0;
            }else{
              statusbutton = 1;
            }

            $.ajax({
                url:'http://showdriver.ru/api/status/'+statusbutton+'/'+tokenUser,
                type:'get',
                success:function(status){
                    showDriver.alert('Статус изменен');
                }
            });

        });


        $(document).off('click', 'span.main-save-personal').on('click', 'span.main-save-personal', function(){

            var name = $$(document).find('input.person-user-name').val();
            var lastname = $$(document).find('input.person-user-lastname').val();
            var otchestvo = $$(document).find('input.person-user-otchestvo').val();

            if(name != '' && lastname != '' && otchestvo != ''){
                $.ajax({
                    url:'http://showdriver.ru/api/save/person/'+name+'/'+lastname+'/'+otchestvo+'/'+tokenUser,
                    type:'get',
                    success:function(person){
                        if(person == 'ok'){
                            showDriver.alert('Сохранено');
                        }else{
                            showDriver.alert('Ошибка, повторите еще раз');
                        }
                    }
                });
            }else{
                showDriver.alert('Заполните обязательные поля');
            }

        });

    }else if(page.name === 'panel-auth'){
        $(document).off('click', 'span.links-panel-auth').on('click', 'span.links-panel-auth', function(e){
            e.preventDefault();
            var tokenUser = window.localStorage.getItem('token');
            showDriver.closePanel('left');
            mainView.loadPage($$(this).attr('data-href')+'/'+tokenUser);
        });

        var tokenUserappend = window.localStorage.getItem('token');
        if(tokenUserappend != '' || tokenUserappend != null){
            $(document).find('.main-nav-links').append('<span class="links-panel-auth" data-href="http://showdriver.ru/api/my-orders"><i class="fa fa-list-alt" aria-hidden="true"></i> Мои заказы</span>');
        }

    }else if(page.name === 'myorders'){

        $(document).off('click', '.user-public-block ul li').on('click', '.user-public-block ul li', function(){
            var tokenUser = window.localStorage.getItem('token');
            var orderId = $(this).attr('data-order-id');
            var nameOrder = $(this).find('h1').text();

            var deletingOrder = confirm("Вы точно хотите удалить "+nameOrder+'?');

            if(deletingOrder == true){
                $.ajax({
                    url:'http://showdriver.ru/api/delete-order/'+orderId+'/'+tokenUser,
                    type:'get',
                    success:function(deleteOrder){
                        $(document).find('.user-public-block ul li[data-order-id="'+orderId+'"]').remove();
                    }
                });
            }

        });

    }else if(page.name === 'save-orders'){

        var tokenUser = window.localStorage.getItem('token');

        $(document).off('click', 'i.delete-save-order').on('click', 'i.delete-save-order', function(){
            var orderid = $(this).attr('data-id-order-save');
            var orderName = $(this).attr('data-name-order-save');
            var saveorderconfirm = confirm('Вы точно хотите удалить '+orderName+'?');

            if(saveorderconfirm === true){
                $.ajax({
                    url:'http://showdriver.ru/api/delete-save-order/'+orderid+'/'+tokenUser,
                    type:'get',
                    success:function(order){
                        if(order === 'ok'){

                            showDriver.alert('Контакт удален.');
                            $(document).find('.main-block-order-list ul li[data-order-list="'+orderid+'"]').remove();

                            var orderListLength = $(document).find('.main-block-order-list ul li').length;
                           
                            if(orderListLength == 0 || orderListLength < 1){
                                $(document).find('.main-block-liked').html('<div class="main-block-not-orders">'+
                                    '<i class="fa fa-file-o" aria-hidden="true"></i><h1>В контактах ничего нет</h1>'+
                                '</div>');
                            }

                        }else{
                            showDriver.alert('Произошла ошибка, попробуйте еще раз');
                        }
                    }
                });
            }
        });

    }else if(page.name === 'registration'){

        $('input.user-reg-phone').mask('+70000000000');

        $(document).off('click', 'input.button-reg-user').on('click', 'input.button-reg-user', function(){
            $(document).find('.bg-not-button-user').css('display','block');
            var phone = $(document).find('input.user-reg-phone').val();
            if(phone != ''){
                $.ajax({
                    url:'http://showdriver.ru/api/registration/'+phone,
                    type:'get',
                    success:function(reg){

                        $(document).find('.bg-not-button-user').css('display','none');

                        if(reg == 'активирован'){
                            showDriver.alert('Данный телефон уже зарегистрирован');
                        }else if(reg == 'repeat'){
                            $(document).find('.main-code-sms').addClass('main-code-sms-open');
                        }else if(reg == 'ok'){
                            $(document).find('.main-code-sms').addClass('main-code-sms-open');
                        }
                        
                    },
                    error:function(error){
                        showDriver.alert('Извините, но в данное время регистрация недоступна');
                        $(document).find('.bg-not-button-user').css('display','none');
                    }
                });
            }else{
                showDriver.alert('Заполните поле');
                $(document).find('.bg-not-button-user').css('display','none');
            }

        });

        $(document).off('click', 'input.user-submit-sms').on('click', 'input.user-submit-sms', function(){
            $(document).find('.bg-not-button-user').css('display','block');
            var codesms = $(document).find('input.user-number-sms').val();
            var phone = $(document).find('input.user-reg-phone').val();

            if(codesms != ''){
                $.ajax({
                    url:'http://showdriver.ru/api/registration/sms/'+codesms+'/'+phone,
                    type:'get',
                    success:function(sms){
                        if(sms.length >= 40){
                            window.localStorage.setItem('token',sms);
                            loadPanel();
                            loadContent();
                            $(document).find('.bg-not-button-user').css('display','none'); 
                        }else{
                            showDriver.alert('Неверный код');
                            $(document).find('.bg-not-button-user').css('display','none'); 
                        }
                    }
                });
            }else{
                showDriver.alert('Неверный код');
                $(document).find('.bg-not-button-user').css('display','none');     
            }
        });

        $(document).off('click', 'span.close-window-sms-code').on('click', 'span.close-window-sms-code', function(){
            $(document).find('.main-code-sms').removeClass('main-code-sms-open');
        });

    }else if(page.name === 'panel-not-auth'){
        $(document).on('click', '.panel-not-auth span.auth-link-menu', function(event){
            event.preventDefault();
            showDriver.closePanel('left');
            mainView.router.back();
        });
        $(document).off('click', '.panel-not-auth span.reg-link-menu').on('click', '.panel-not-auth span.reg-link-menu', function(event){
            event.preventDefault();
            var link = $(this).attr('data-href');
            showDriver.closePanel('left');
            mainView.loadPage(link);
        });
    }else if(page.name === 'make-order'){

        var tokenUser = window.localStorage.getItem('token');

        $(document).find('select.region-main').change(function(){
            var region = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-city/'+region+'/'+tokenUser,
                type:'get',
                success:function(cities){
                    $$(document).find('select.city-main').html('');
                    $$(document).find('select.city-main').css('display','block');
                    var cities = JSON.parse(cities);
                    var t = 0;
                    for(t; t < cities.length; t++){
                        $$(document).find('select.city-main').append('<option value="'+cities[t].id+'">'+cities[t].city_name+'</option>');
                    }
                }
            });
        });

        $(document).find('select.main-cat-service').change(function(){
            var idservice = $(this).val();
            $.ajax({
                url:'http://showdriver.ru/api/get-services/'+idservice+'/'+tokenUser,
                type:'get',
                success:function(services){
                    $$(document).find('select.main-list-services').css('display','block');
                    var y = 0;
                    var services = JSON.parse(services);
                    $$(document).find('select.main-list-services').html('');
                    if(idservice == 1){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].service_id+'">'+services[y].service_name+'</option>');
                        }
                    }else if(idservice == 2){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].decor_id+'">'+services[y].decor_name+'</option>');
                        }
                    }else if(idservice == 3){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].arenda_id+'">'+services[y].arenda_name+'</option>');
                        }
                    }else if(idservice == 4){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].service_home_id+'">'+services[y].service_home_name+'</option>');
                        }
                    }else if(idservice == 5){
                        for(y; y < services.length; y++){
                            $$(document).find('select.main-list-services').append('<option value="'+services[y].organization_id+'">'+services[y].organization_name+'</option>');
                        }
                    }
                }
            });
        });

        $(document).off('click', 'input.submit-user-zakaz').on('click', 'input.submit-user-zakaz', function(){
            var cityIdzakaz = $$(document).find('select.city-main').val();
            var serviceIdzakaz = $$(document).find('select.main-list-services').val();
            var catidzakaz = $$(document).find('select.main-cat-service').val();
            var gonorarPrice = $$(document).find('input.user-gonorar-zakaz').val();
            var dateUser = $$(document).find('input.date-mitting').val();

            if(cityIdzakaz != '' && serviceIdzakaz != '' && gonorarPrice != '' && dateUser != ''){

                $.ajax({
                    url:'http://showdriver.ru/api/save-make-order/'+cityIdzakaz+'/'+serviceIdzakaz+'/'+catidzakaz+'/'+gonorarPrice+'/'+dateUser+'/'+tokenUser,
                    type:'get',
                    success:function(zakaz){
                        if(zakaz == 'ok'){
                            showDriver.alert('Заказ опубликован, ожидайте ответа');
                            mainView.loadPage('http://showdriver.ru/api/my-orders/'+tokenUser);
                        }
                    }
                });

            }else{
                showDriver.alert('Заполните поля');
            }

        });

    }

});

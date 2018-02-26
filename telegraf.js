const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

var moment = require('moment');
moment.locale('ru');

var mysql = require('mysql');

var empty = require('is-empty');

var con = mysql.createConnection({
  host: "localhost",
  user: "top4ek",
  password: "q2w3e4r5",
  database: "telegram"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM coffee", function (err, result, fields) {
    if (err) throw err;
    //global.status = result[1].count;
    console.log('Connect to database is successful');
  });
});

// Доставка откуда
const shippingOptions = [
  {
    id: 'first',
    title: 'Нахимова 30',
    prices: [{ label: 'Unicorn', amount: 0 }]
  },
  {
    id: 'second',
    title: 'Белинского 51',
    prices: [{ label: 'Slowpoke', amount: 0 }]
  }
]

// Ниче не надо - цикл бесконечной

const black = ['Назад','Американо 55₽','Двойной 99₽','Черный кофе с можевельником 119₽','Черный кофе с кардамоном 119₽', 'Эспрессо 89₽', 'Допио 99₽']
const classic = ['Назад','Маленький латте 99₽','Большой латте 129₽','Маленький Капучино 89₽','Большой Капучино 119₽','Раф 149₽','Флэт уайт 119₽','Соевый латте малый 100₽','Соевый латте большой 200₽']
const author = ['Назад','Лавандовый раф 159₽','Розовый мужской латте 159₽','Медово-имбирный капучино 159₽','Коколатте 159₽','Имбирно-жасминовый латте 159₽','Кедровый латте маленький 149₽','Кедровый латте большой 199₽','Цитрусовый раф маленький 149₽','Цитрусовый раф большой 199₽','Клауд ЧСМ маленький 149₽','Клауд ЧСМ большой 199₽','Крем брюле маленький 149₽','Крем брюле большой 199₽','Прованский латте 159₽','Грушевая самбука 159₽','Рафт лемонграсс 199₽']
const chocolate = ['Назад','Горячий шоколад 99₽','Горячий шоколад с зефирками 130₽','Какао 109₽','Какао с зефирками 140₽','Ягодный напиток: брусника с мятой 89₽','Ягодный напиток: облипиха с можевельником 89₽']
const alternative =['Назад','Колдбрю 199₽','Пуровер (V60) 159₽','Кемекс 159₽','Аэропресс 159₽']
const soeviy = ['Назад','Соевый латте маленький 140₽','Соевый латте большой 190₽','Соевый Капучино маленький 130₽','Соевый Капучино большой 180₽','Соевый Коколатте мята 249₽','Соевый Коколатте шоколад 249₽','Кедровый латте на сое маленький 199₽','Кедровый латте на сое большой 249₽']
const syrop = ['Назад','Ирландский крем 21₽','Карамель 21₽','Кокос 21₽','Шоколад 21₽','Мята 21₽','Ваниль 21₽','Амаретто 21₽','Яблочный пирог 21₽','Лесной орех 21₽','Спасибо, ничего']
const addons = ['Назад','Добавить сироп','1 ложка сахара','2 ложки сахара','3 ложки сахара','Погорячее','Корица для запаха','Корица для вкуса','Мускатный орех','Мед 31₽','Молоко 21₽','Холодное молоко 21₽','Сливки 21₽','Холодные сливки 21₽']
const alternative_addons = ['Назад','Эфиопия','Кения','Колумбия','Руанда']
const replyOptions = Markup.inlineKeyboard([
  Markup.payButton('💸 Buy'),
  Markup.urlButton('❤️', 'http://telegraf.js.org')
]).extra()

const bot = new Telegraf('533773646:AAE_SpgrQ-f0C79JEItux0dWfy9uk0Lq5-Y')

bot.start((ctx) => {
  var query = con.query("SELECT chat_id, status FROM coffee WHERE chat_id = "+ctx.from.id+"", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
    if(result[0] == undefined){
      var sql = "INSERT INTO coffee (chat_id, user_name) VALUES ("+ctx.from.id+", '"+ctx.from.username+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("User recorded to database");
      });
      ctx.reply('Привет, для начала использования напиши мне /start')
    }else{
      var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
      hard_keyboard(ctx, 'Меню:', array);
      console.log('Сделать заказ')
      updateStatus(1,ctx.from.id)
    }
  })
})
bot.on('pre_checkout_query', ({ answerPreCheckoutQuery }) => answerPreCheckoutQuery(true))
bot.on('successful_payment', (ctx) => {
    console.log('Payed successful')
    var chat_id = ctx.from.id
    ctx.reply('Ждем вас на Белинского 51')
    //easy_keyboard(chat_id, "Ждем вас по адресу Белинского 51.\nСейчас вы можете что-нибудь дозаказать",['Назад','Заказ получен.'])
    var query = con.query("SELECT id, chat_id, status, time, coffee, price, comment FROM coffee WHERE chat_id = "+chat_id+"", function (err, result, fields) {
        if (err) throw err;
        var status = result[0].status;
        var replace = result[0].coffee.split('$').join('\n')
        var id = result[0].id
        var keyboard = ''
        var time = parseInt(result[0].time)
        var query1 = con.query("SELECT comment FROM coffee WHERE chat_id = 548789421", function (err, result, fields) {
            if (err) throw err;
            keyboard = result[0].comment + 'ПРИГОТОВИЛ заказ #'+id+' В '+moment().add(time, 'minutes').format('LT') + '$'
            var sql = "UPDATE coffee SET comment = '"+keyboard+"' WHERE chat_id = 548789421";
                con.query(sql, function (err, result) {
                if (err) throw err;
            })
        var n = 0
        function reminders(ctx,chat_id,replace,time,keyboard,n){
            var status = con.query("SELECT id, status FROM coffee WHERE chat_id = "+chat_id+"", function (err, res, fields) {
                if (err) throw err;
                time = time - n
                if(res[0].status !== 200){
                    ctx.telegram.sendMessage(548789421, 'Заказ #'+id, Markup
                        .keyboard(keyboard)
                        .oneTime()
                        .resize()
                        .extra()
                    )
                   ctx.telegram.sendMessage(548789421, '\nВремя: '+moment().format('LT')+'\n'+'Клиент прибудет через '+time+' минут\n\n'+replace+'\nКомментарий: '+result[0].comment, Markup
                        .inlineKeyboard([
                          Markup.callbackButton('Принять', 'Good:'+chat_id+'')
                          //Markup.callbackButton('Отменить', 'Bad:'+chat_id+'')
                        ])
                        .oneTime()
                        .resize()
                        .extra()
                    )
                    setTimeout(reminders, 60000, ctx,chat_id,replace,time,n+1)
                }else{
                    return 0;
                }
            })
        } 
        reminders(ctx,chat_id,replace,time,keyboard.split('$'),n)
        function fiveMinutes(ctx,chat_id,replace,id,n){
            ctx.telegram.sendMessage(548789421, 'Заказ #'+id+'\nВремя: '+moment().format('LT')+'\n'+'!!!Клиент прибудет через 5 минут!!!\n\n'+replace+'\nКомментарий: '+result[0].comment)
        }
        if((result[0].time - 5) > 0){
            setTimeout(fiveMinutes, (result[0].time*60-300)*1000/*10000*/, ctx,chat_id,replace,id)
        }
            //setTimeout(fiveMinutes, (result[0].time*60-300)*1000/*10000*/, ctx,chat_id,replace,id)
            //console.log(keyboard.split('$'))
        })
        
    })
    //548789421 Саша Погожев
    //ctx.telegram.sendMessage(83856998, 'Зак', `Hello`)
    //ctx.reply('Заказ успешно оплачен. Ожидайте подтверждение баристы.')
})
/* ---------------------------------*/
// БАРИСТА-
/* ---------------------------------*/
bot.action(/.+/, (ctx) => {
    var arr = ctx.match[0].split(':')
    var answer = arr[0]
    var chat_id = arr[1]
    if(answer == 'Good'){
        console.log(chat_id)
        var query = con.query("SELECT status FROM coffee WHERE chat_id = "+chat_id+"", function (err, result, fields) {
            if (err) throw err;
            if(result[0].status !== 200){
                updateStatus(200, chat_id)
                ctx.telegram.sendMessage(chat_id,'Бариста принял ваш заказ! Ждем :)')
            }
        })
    }
    if(ctx.match[0] == 'BackButton'){
        chat_id = ctx.from.id
        var query = con.query("SELECT id, chat_id, status, time, coffee, price, comment, old_price, coffee_old FROM coffee WHERE chat_id = "+chat_id+"", function (err, result, fields) {
            if (err) throw err;
            var status = result[0].status
            if(status == 1){
                var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                hard_keyboard(ctx, 'Меню:', array);
                console.log('Сделать заказ')
            }
            if(status == 2 || status == 22){
                var price_1 = 0
                var order = result[0].coffee.split('$')
                console.log(order)
                order.pop()
                order.pop()
                console.log(order)
                /*var query = con.query("UPDATE coffee SET old_price = "+result[0].price+", coffee = '"+order.join("$")+"$', status = 1 WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                    if (err) throw err;
                    console.log('Price replaced')
                    var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                    hard_keyboard(ctx, 'Меню:', array);
                })*/
            }
            if(status == 3){
                easy_keyboard(ctx,'Выбрать еще кофе?', ['Назад','Выбрать еще','Закончить'])
                updateStatus(2,ctx)
            }
            if(status == 4){
                ctx.reply('Через сколько минут вас ожидать?\nНапишите цифру')
                updateStatus(3,chat_id)
            }
            if(status == 19){
                easy_keyboard(ctx,'Комментарий',['Назад','Без комментария'])
                updateStatus(19, chat_id)
            }
            if(status == 21 || status == 17 || status == 18 || status == 20){
                var order = result[0].coffee.split('$')
                console.log(order)
                order.pop()
                console.log(order)
                var query = con.query("UPDATE coffee SET coffee = '"+order.join("$")+"$', status = 1 WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                    if (err) throw err;
                    console.log('status 21 replaced')
                    var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                    hard_keyboard(ctx, 'Меню:', array);
                })
            }
            if(status == 6){
                hard_keyboard(ctx,'Выполнить заказ', ['Оплата','','Изменить время','','Удалить','Дозаказ'])
                updateStatus(5,chat_id)
            }
        })
    }
})
/* ---------------------------------*/
// КЛИЕНТ
/* ---------------------------------*/
bot.on('message', (ctx) => {
    var chat_id = ctx.from.id;
    var query = con.query("SELECT id, chat_id, status, time, coffee, price, comment, old_price, coffee_old FROM coffee WHERE chat_id = "+chat_id+"", function (err, result, fields) {
        if (err) throw err;
        if(result[0] == undefined){
          var sql = "INSERT INTO coffee (chat_id, user_name) VALUES ("+ctx.from.id+", '"+ctx.from.username+"')";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("User recorded to database");
          });
          ctx.reply('Привет, для начала использования напиши мне /start')
        }else{
            var status = result[0].status;
            var answer = ctx.message.text
            var replace = result[0].coffee.split('$').join('\n')
            if(answer == 'Сделать заказ'){
                var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                hard_keyboard(ctx, 'Меню:', array);
                updateStatus(1, chat_id);
                console.log('Сделать заказ')
            }
            if(answer.indexOf('ПРИГОТОВИЛ') >= 0){
                if(result[0].comment !== ''){
                    var enter = result[0].comment.split('$')
                    var test = result[0].comment.split(' ')
                    var id = parseInt(retnum(test[2]), 10)
                    enter.pop()
                    console.log(enter)
                    for (var i = 0; i < enter.length; i++) {
                        if(answer == enter[i]){
                            enter.splice(i,1)
                        }
                    }
                    var query = con.query("UPDATE coffee SET comment = '"+enter.join('$')+"$' WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                        if (err) throw err;
                        if((enter.length == 1 && enter[0] == '') || enter.length == 0){
                            ctx.telegram.sendMessage(548789421, 'Заказ #'+id+' Выполнен! :))')
                            var query = con.query("UPDATE coffee SET comment = '' WHERE chat_id = "+chat_id+"", function (err, res, fields) {
                                if (err) throw err;
                            })
                        }else{
                            ctx.telegram.sendMessage(548789421, 'Заказ #'+id+' Выполнен! :))', Markup
                                .keyboard(enter)
                                .oneTime()
                                .resize()
                                .extra()
                            )
                        }
                    })
                    var query = con.query("SELECT chat_id FROM coffee WHERE id = "+id+"", function (err, res, fields) {
                        if (err) throw err;
                        var query = con.query("DELETE FROM `coffee` WHERE `coffee`.`id` = "+id+"", function (err, result, fields) {
                            if (err) throw err;
                            ctx.telegram.sendMessage(res[0].chat_id, 'Ваш заказ выполнен!')
                        })
                    })
                }
            }        
            if(status == 1){
                console.log(black)
                if(answer == 'Черный кофе'){
                    easy_keyboard(ctx, 'Черный кофе', black)
                    updateStatus(17, chat_id)
                }
                if(answer == 'Классический c молоком'){
                    easy_keyboard(ctx, 'Классический c молоком', classic)
                    updateStatus(17, chat_id)
                }
                if(answer == 'Авторские'){
                    easy_keyboard(ctx, 'Авторские', author)
                    updateStatus(30, chat_id)
                }
                if(answer == 'Альтернативный кофе'){
                    easy_keyboard(ctx, 'Альтернативный кофе', alternative)
                    updateStatus(21, chat_id)
                }
                if(answer == 'Горячий шоколад, какао и ягодные'){
                    easy_keyboard(ctx, 'Горячий шоколад, какао и ягодные', chocolate)
                    updateStatus(17, chat_id)
                }
                if(answer == 'Кофе с соевым молоком'){
                    easy_keyboard(ctx, 'Кофе с соевым молоком', soeviy)
                    updateStatus(17,chat_id)
                }
            }
            // Альтернативный
            if(status == 21){
                if(answer !== 'Назад'){
                    easy_keyboard(ctx, 'Вы выбрали '+answer+'\nВыберите страну',alternative_addons)
                    var price = parseInt(retnum(answer), 10)
                    console.log(price)
                    var sql = "UPDATE coffee SET coffee_old = '"+answer+"', old_price = "+price+", status = 22 WHERE chat_id = "+chat_id+"";
                        con.query(sql, function (err, result) {
                          if (err) throw err;
                          console.log(result.affectedRows + " record(s) updated");
                    });
                }else{
                    var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                    hard_keyboard(ctx, 'Меню:', array);
                    updateStatus(1, chat_id);
                    console.log('Сделать заказ')
                }
            }
            if(status == 22){
                if(answer !== 'Назад'){
                    easy_keyboard(ctx, 'Вы выбрали '+answer,['Назад','Выбрать еще','Закончить'])
                    var enter = result[0].coffee_old + answer
                    var sql = "UPDATE coffee SET coffee_old = '"+enter+"', status = 2 WHERE chat_id = "+chat_id+"";
                        con.query(sql, function (err, result) {
                          if (err) throw err;
                          console.log(result.affectedRows + " record(s) updated");
                    });
                }else{
                    updateStatus(1,chat_id)
                    var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                    hard_keyboard(ctx, 'Меню:', array);
                }
                
            }
            /*if(status == 22){
                if(answer !== 'Назад'){
                    easy_keyboard(ctx, 'Вы выбрали '+answer,['Назад','Выбрать еще','Закончить'])
                    var enter = result[0].coffee + answer
                    var sql = "UPDATE coffee SET coffee = '"+enter+"', status = 2 WHERE chat_id = "+chat_id+"";
                        con.query(sql, function (err, result) {
                          if (err) throw err;
                          console.log(result.affectedRows + " record(s) updated");
                    });
                }else{
                    var price_1 = 0
                    var order = result[0].coffee.split('$')
                    order.pop()
                    var query = con.query("UPDATE coffee SET old_price = "+result[0].price+", coffee = '"+order.join("$")+"', status = 1 WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                        if (err) throw err;
                        console.log('Price replaced')
                        var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                        hard_keyboard(ctx, 'Меню:', array);
                    })
                }
                
            }*/
            // Авторские
            if(status == 30){
                easy_keyboard(ctx, 'Вы выбрали '+answer,['Назад','Выбрать еще','Закончить'])
                var old_price = parseInt(retnum(answer), 10)
                var sql = "UPDATE coffee SET coffee_old = '"+answer+"', old_price = "+old_price+", status = 2 WHERE chat_id = "+chat_id+"";
                    con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log(result.affectedRows + " record(s) updated");
                });
            }
            // ДОБАВКИ!!!
            if(status == 17){
                if(answer !== 'Назад'){
                    easy_keyboard(ctx, 'Вы выбрали '+answer+'\nСахар, специи, сиропы, погорячее?.',['Назад','Да','Спасибо, нет. Продолжить'])
                    //var enter = result[0].coffee_old + answer
                    var old_price = result[0].old_price + parseInt(retnum(answer), 10)
                    var sql = "UPDATE coffee SET coffee_old = '"+answer+"', old_price = "+old_price+", status = 18 WHERE chat_id = "+chat_id+"";
                        con.query(sql, function (err, result) {
                          if (err) throw err;
                    });
                }else{
                    var order = result[0].coffee_old.split('+')
                    var price = result[0].old_price - parseInt(retnum(order[order.length]), 10)
                    if(order.length == 0){
                        // в самое начало 
                        var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                        hard_keyboard(ctx, 'Меню:', array);
                        updateStatus(1, chat_id);
                        console.log('Сделать заказ')
                    }else{
                        console.log(order)
                        order.pop()
                        console.log(order)
                        var query = con.query("UPDATE coffee SET old_price = "+result[0].old_price+", coffee_old = '"+order.join("+")+"', status = 1 WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                            if (err) throw err;
                            console.log('status 2')
                            easy_keyboard(ctx, 'Вы выбрали '+order.join("+")+'\nСахар, специи, сиропы, погорячее?.',['Назад','Да','Спасибо, нет. Продолжить'])
                        })
                    }
                }
            }
            if(status == 18){
                if(answer !== 'Назад'){
                    if(answer !== 'Спасибо, нет. Продолжить'){
                        easy_keyboard(ctx,'Добавки:', addons)
                        updateStatus(20, chat_id)
                    }else{
                        var enter = result[0].coffee_old
                        var sql = "UPDATE coffee SET coffee_old = '"+enter+"', status = 2 WHERE chat_id = "+chat_id+"";
                        con.query(sql, function (err, result) {
                          if (err) throw err;
                          console.log(result.affectedRows + " record(s) updated");
                        });
                        easy_keyboard(ctx,'Добавлено в заказ', ['Назад','Выбрать еще','Закончить'])
                    }
                }else{
                    var order = result[0].coffee_old.split('+')
                    var length = order.length
                    console.log(length)
                    var price = result[0].old_price - parseInt(retnum(order[length-1]), 10)
                    console.log(price)
                    if(isNaN(price)){
                        price = result[0].old_price
                        console.log('ЭТО ГОВНО ИЗ НАН!')
                    }else{
                        console.log('ЭТО ГОВНО НЕ ИЗ НАН!!!!!((!(!(!(((!')
                    }
                    if(order.length == 1){
                        // в самое начало 
                        var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                        hard_keyboard(ctx, 'Меню:', array);
                        updateStatus(1, chat_id);
                        console.log('Сделать заказ')
                    }else{
                        console.log(order)
                        order.pop()
                        console.log(order)
                        var query = con.query("UPDATE coffee SET old_price = "+price+", coffee_old = '"+order.join("+")+"' WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                            if (err) throw err;
                            console.log('status 2')
                            easy_keyboard(ctx, 'Вы выбрали '+order.join("+")+'\nСахар, специи, сиропы, погорячее?.',['Назад','Да','Спасибо, нет. Продолжить'])
                        })
                    }
                }
            }
            // ДОБАВКИ ПРОДОЛЖЕНИЕ
            if(status == 20){
                if(answer !== 'Назад'){
                    if(answer !== 'Добавить сироп'){
                        var enter = result[0].coffee_old + ' + ' + answer
                        var old_price = result[0].old_price + parseInt(retnum(answer), 10)
                        if(!isNaN(old_price) && parseInt(retnum(answer), 10) > 20){
                            var sql = "UPDATE coffee SET coffee_old = '"+enter+"', old_price = "+old_price+", status = 18 WHERE  chat_id = "+chat_id+"";
                                con.query(sql, function (err, result) {
                                  if (err) throw err;
                                  console.log(result.affectedRows + " record(s) updated");
                            });
                        }else{
                            var sql = "UPDATE coffee SET coffee_old = '"+enter+"', status = 18 WHERE chat_id = "+chat_id+"";
                                con.query(sql, function (err, result) {
                                  if (err) throw err;
                                  console.log(result.affectedRows + " record(s) updated");
                            });
                        }
                        easy_keyboard(ctx,'Вы выбрали '+answer+'\nСахар, специи, сиропы, погорячее?',['Назад','Да','Спасибо, нет. Продолжить'])
                    }else if(answer == 'Добавить сироп'){
                        easy_keyboard(ctx,'Выберите сироп!',syrop)
                    }
                }else{
                    var order = result[0].coffee_old.split('+')
                    var price = result[0].old_price - parseInt(retnum(order[order.length]), 10)
                    if(order.length == 0){
                        // в самое начало 
                        var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                        hard_keyboard(ctx, 'Меню:', array);
                        updateStatus(1, chat_id);
                        console.log('Сделать заказ')
                    }else{
                        console.log(order)
                        order.pop()
                        console.log(order)
                        var query = con.query("UPDATE coffee SET old_price = "+result[0].old_price+", coffee_old = '"+order.join("+")+"', status = 1 WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                            if (err) throw err;
                            console.log('status 2')
                            easy_keyboard(ctx, 'Вы выбрали '+order.join("+")+'\nСахар, специи, сиропы, погорячее?.',['Назад','Да','Спасибо, нет. Продолжить'])
                        })
                    }    
                }
            }
            if(status == 2){
                var x = 0
                for (var i = 0; i < author.length; i++) {
                    if(answer == author[i]){
                        x = 1
                    }
                }
                if(x == 0){
                    if(answer !== 'Назад'){
                        var price = result[0].price + result[0].old_price
                        var sql = "UPDATE coffee SET coffee = '"+result[0].coffee+result[0].coffee_old+"$', coffee_old = '', price = '"+price+"' WHERE  chat_id = "+chat_id+"";
                            con.query(sql, function (err, result) {
                              if (err) throw err;
                              console.log(result.affectedRows + " record(s) updated");
                        });
                        if(answer == 'Выбрать еще'){
                            var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                            hard_keyboard(ctx, 'Меню:', array);
                            updateStatus(1, chat_id);
                        }
                        if(answer == 'Закончить'){
                            easy_keyboard(ctx,'Через сколько минут вас ожидать?\nНапишите цифру',['Назад'])
                            updateStatus(3, chat_id)
                        }
                    }else{
                        var order = result[0].coffee_old.split('+')
                        var price = result[0].old_price - parseInt(retnum(order[order.length]), 10)
                        if(order.length == 0){
                            // в самое начало 
                            var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                            hard_keyboard(ctx, 'Меню:', array);
                            updateStatus(1, chat_id);
                            console.log('Сделать заказ')
                        }else{
                            console.log(order)
                            order.pop()
                            console.log(order)
                            var query = con.query("UPDATE coffee SET old_price = "+result[0].old_price+", coffee_old = '"+order.join("+")+"', status = 1 WHERE chat_id = "+chat_id+"", function (err, result, fields) {
                                if (err) throw err;
                                console.log('status 2')
                                easy_keyboard(ctx, 'Вы выбрали '+order.join("+")+'\nСахар, специи, сиропы, погорячее?.',['Назад','Да','Спасибо, нет. Продолжить'])
                            })
                        }
                    }
                }else{
                    if(answer !== 'Назад'){
                        var sql = "UPDATE coffee SET coffee = '"+result[0].coffee+result[0].coffee_old+"$', coffee_old = '', price = '"+result[0].old_price+"' WHERE  chat_id = "+chat_id+"";
                            con.query(sql, function (err, result) {
                              if (err) throw err;
                              console.log(result.affectedRows + " record(s) updated");
                        });
                        if(answer == 'Выбрать еще'){
                            var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                            hard_keyboard(ctx, 'Меню:', array);
                            updateStatus(1, chat_id);
                        }
                        if(answer == 'Закончить'){
                            easy_keyboard(ctx,'Через сколько минут вас ожидать?\nНапишите цифру',['Назад'])
                            updateStatus(3, chat_id)
                        }
                    }else{
                        var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                        hard_keyboard(ctx, 'Меню:', array);
                        updateStatus(1, chat_id);
                        console.log('Сделать заказ')
                    }
                }
            }
            if(status == 3){
                if(answer !== 'Назад'){
                    if (!isNaN(answer)) {
                        easy_keyboard(ctx,'Ожидать вас через '+answer+' минут?',['Да','Нет',''])
                        var sql = "UPDATE coffee SET time = '"+answer+"', status = 4 WHERE chat_id = "+chat_id+"";
                                con.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log('Товар удален');
                        });
                    }else{
                        ctx.reply('Введите число')
                    }
                }else{
                    updateStatus(1, chat_id)
                    var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                    hard_keyboard(ctx, 'Меню:', array);
                }
                
            }
            if(status == 4){
                if(answer !== 'Назад'){
                    if(answer == 'Да'){
                        easy_keyboard(ctx,'Комментарий',['Назад','Без комментария'])
                        updateStatus(19, chat_id)
                    }else{
                        ctx.reply('Через сколько минут вас ожидать?\nНапишите цифру')
                        updateStatus(3, chat_id)
                    }
                }else{
                    easy_keyboard(ctx,'Через сколько минут вас ожидать?\nНапишите цифру',['Назад'])
                    updateStatus(3, chat_id)
                }
                
            }
            if(status == 19){
                if(answer !== 'Назад'){
                    if(answer !== 'Без комментария'){
                        var sql = "UPDATE coffee SET comment = '"+answer+"', status = 5 WHERE chat_id = "+chat_id+"";
                            con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log('Товар удален');
                        });
                    }else{
                        updateStatus(5, chat_id)
                    }
                    hard_keyboard(ctx,'Выполнить заказ', ['Оплата','','Изменить время','','Удалить','Дозаказ'])
                }else{
                    easy_keyboard(ctx,'Через сколько минут вас ожидать?\nНапишите цифру',['Назад'])
                    updateStatus(3, chat_id)
                }
            }
            if(status == 5){
                if(answer == 'Оплата'){
                    ctx.replyWithInvoice(invoice_func(replace,parseInt(result[0].price, 10)*100))
                }
                if(answer == 'Изменить время'){
                    ctx.reply('Через сколько минут вас ожидать?\nНапишите цифру')
                    updateStatus(3,chat_id)
                }
                if(answer == 'Удалить'){
                    var order = result[0].coffee.split('$')
                    easy_keyboard(ctx,'Чтобы удалить какой-то товар просто нажмите на него на клавиатуре.',order)
                    updateStatus(6, chat_id)
                }
                if(answer == 'Дозаказ'){
                    var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                    hard_keyboard(ctx, 'Меню:', array);
                    updateStatus(1,chat_id)
                }
            }
            // Удалить или изменить
            if(status == 6){
                var price_1 = 0
                var order = result[0].coffee.split('$')
                console.log(order)
                order.pop()
                for (var i = 0; i <= order.length; i++) {
                    if(answer == order[i]){
                        order.splice(i,1)
                        var answ = answer.split('+')
                        for (var k = 0; k < answ.length; k++) {
                            price_1 = price_1 + parseInt(retnum(answ[k]), 10)
                        }
                        price_1 = result[0].price - price_1
                        console.log(order)
                        console.log(order.length)
                        if((order.length == 1 && order[0] == '') || order.length == 0){
                            var array = ['Черный кофе','Классический c молоком','Авторские','Альтернативный кофе','Горячий шоколад, какао и ягодные','Кофе с соевым молоком'];
                            var sql = "UPDATE coffee SET coffee = '', price = 0, status = 1 WHERE chat_id = "+chat_id+"";
                                con.query(sql, function (err, result) {
                                if (err) throw err;
                                hard_keyboard(ctx, 'Ваш заказ пуст, Выберите что-нибудь из меню', array);
                            });
                            //updateStatus(1, chat_id);
                            console.log('Сделать заказ')
                        }else{
                            var sql = "UPDATE coffee SET coffee = '"+order.join("$")+"$', price = "+price_1+", status = 5 WHERE chat_id = "+chat_id+"";
                                con.query(sql, function (err, result) {
                                if (err) throw err;
                                hard_keyboard(ctx,'Товар удален', ['Оплата','','Изменить время','','Удалить','Дозаказ'])
                            });
                        }
                    }
                }
            }
            if(status == 200){
                ctx.reply('Мы вас ждем! :)\nБелинского 51')
            }
        }
    })
})
bot.command('/qwe', (ctx) => {
    console.log('menu view')
})
//bot.command('/buy', ({ replyWithInvoice }) => replyWithInvoice(invoice, replyOptions))
function updateStatus(status, chat_id){
    var sql = "UPDATE coffee SET status = "+status+" WHERE chat_id = "+chat_id+"";
        con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
}
function easy_keyboard(ctx,text,array){
    var array_func = array
    //console.log(array_func.unshift('Назад'));
    ctx.reply(text, Markup
        .keyboard(array_func)
        .oneTime()
        .resize()
        .extra()
    )
    //setTimeout(backButton, 100, ctx) 
}
function backButton(ctx){
    ctx.reply('.', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
          m.callbackButton('Назад', 'BackButton')
    ]))) 
}
function hard_keyboard(ctx,text,array){
    ctx.reply(text, Markup
        .keyboard([
          [array[0],array[1]],
          [array[2],array[3]],
          [array[4],array[5]]
        ])
        .oneTime()
        .resize()
        .extra()
    )
}
// menu func

function menu(ctx){
    ctx.reply(text, Markup
        .keyboard([
            ('coke', 'test'),
            'prostakola'
            ])
        .oneTime()
        .resize()
        .extra()
    )
}

function invoice_func(order, price){
    const invoice = {
      provider_token: '401643678:TEST:051715d5-9cf9-4f4b-b63f-e92728c26e60',
      start_parameter: 'coffee',
      title: 'Заказ',
      description: order,
      currency: 'rub',
      photo_url: 'https://pbs.twimg.com/profile_images/520085024968671233/ul2Omvpm.jpeg',
      prices: [
        { label: 'Заказ', amount: price }
      ],
      payload: {
        coupon: 'test'
      }
    }
    return invoice
}
function retnum(str) { 
    var num = str.replace(/[^0-9]/g, '')
    return num
}

bot.startPolling()
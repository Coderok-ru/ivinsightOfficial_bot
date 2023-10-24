const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const fs = require('fs');
const complement = require('./compl.json');
const axios = require('axios');
const { match } = require('assert');


//Инициализируем переменные из .env
require('dotenv').config();

//Инициализируем бота
const bot = new TelegramBot(process.env.API_KEY_BOT, {

    polling: true

});

//Массив с объектами для меню команд
const commands = [

    {command: "start", description: "Запуск бота"},
    {command: "calc", description: "Калькулятор здоровья"},
    {command: "recipies", description: "Рецепты блюд"},
    {command: "link", description: "Открыть сайт"},
    {command: "help", description: "Раздел помощи"},
    {command: "complement", description: "Получить комплимент"},
    {command: "promo", description: "Скидки и акции"},
    
    // {command: "menu", description: "Меню-клавиатура"},
    // {command: 'second_menu', description: "Второе меню"},
    // {command: "ref", description: "Получить реферальную ссылку"}

]

//Устанавливаем меню команд
bot.setMyCommands(commands);

//Слушатель для текстового сообщения
bot.on('text', async msg => {

    try {

        //Обрабатываем запуск бота
        if(msg.text.startsWith('/start')) {
            
            //Приветственное сообщение
            await bot.sendMessage(msg.chat.id, `Приветули, ${msg.from.first_name}! Меня зовут ИвиБот и я тут что-бы во все помогать тебе.👋🏻`);

            setTimeout(async () => {

                await bot.sendMessage(msg.chat.id, 'Сейчас ты можешь открыть меню и увидеть все то чем я могу быть полезен, пока что! А так же ты всегда можешь запросить помощь написав команду "/help"');
        
            }, 4000);

            //Проверяем, был ли запущен бот по ссылке из раздела /ref
            if(msg.text.length > 6) {
                //Получаем ID из параметров запуска бота
                const refID = msg.text.slice(7);
                //Если человек зашёл по ref-ссылке, то ему придёт сообщение с информацией об этом
                await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);

            }

        }
        else if(msg.text == '/ref') {

            //Делаем ссылку на запуск в бота, в которой передаём ID пользователя
            await bot.sendMessage(msg.chat.id, `${process.env.URL_TO_BOT}?start=${msg.from.id}`);

        }
        else if(msg.text == '/help') {

            //HTML-стилизации текста
            await bot.sendMessage(msg.chat.id, `<strong>Добро пожаловать!</strong>
            IviBot - это маленький бот помощник, созданный для того что бы помогать тебе на пути к своему идеальному телу.\n\n
            Мы очень старались в разработке этого бота. Поэтому усли он будет иногда косячить - не ругай его! Мы его всему обучим!\n\n
            Для удобной навигации ты открыть меню или воспользоваться командами:\n
            <code>/start</code> - <em>запуск IviBot</em>\n
            <code>/calc</code> - <em>калькулятор здоровья</em>\n
            <code>/recipies</code> - <em>рецепты блюд</em>\n
            <code>/complement</code> - <em>получить комплимент от IviBot</em>\n
            <code>/link</code> - <em>перейти на сайт</em>\n
            <code>/promo</code> - <em>скидки и акции</em>\n
            Hазработчик и поддержка бота: <a href="https://coderok.ru">Andrey Lyubichenko</a>`, {

                parse_mode: "HTML"

            });

            

        }
        else if(msg.text == '/link') {

            await bot.sendMessage(msg.chat.id, 'О! Вот ссылка на самый полезный и красивый сайт!');
            await bot.sendMessage(msg.chat.id, `https://ivinsight.ru`, {

                //Выключаем превью ссылки в сообщении
                disable_web_page_preview: false,
                //Отключаем уведомление о сообщении для пользователя
                disable_notification: true

            });

        }
        else if(msg.text == '/recipies') {

            await bot.sendMessage(msg.chat.id, `Обожаю готовить вкусняхи! ${msg.from.first_name} что мы будем готовить сегодня?`);
            await bot.sendMessage(msg.chat.id, `Рецепты блюд`, {

                reply_markup: {
                    //Добавляем инлайн-клавиатуру
                    inline_keyboard: [

                        [{text: 'Завтраки', callback_data: 'breakFast'}, {text: 'Холодные закуски', callback_data: 'coldSnack'}],
                        [{text: 'Супы', callback_data: 'soups'}, {text: 'Десерты', callback_data: 'desserts'}],
                        [{text: 'Вторые блюда', callback_data: 'secondFast'}, {text: 'Напитки', callback_data: 'drinks'}],
                        [{text: 'Горячие закуски', callback_data: 'hotSnack'}]

                    ]

                },
                //Сообщение будет ответом на сообщение пользователя
                reply_to_message_id: msg.message_id

            })

        }
        else if(msg.text == '/complement') {

            const getRandom = complement[Math.floor(Math.random() * complement.length)];
            await bot.sendMessage(msg.chat.id, getRandom);


        }
        else if(msg.text == '/calc') {

            let user = {
                name: ``,
                rost: 0,
                ves: 0,
                age: 0,
                active: 0,
                sex: 0
            }

            await bot.sendMessage(msg.chat.id, "Подожди! Я еще просчитываю алгоритмы как я это буду все делать. Я хочу считать все точно, выдавать максимум полезной информации, строить графики для тебя и отправлять тебе pdf файл с результатами. Поэтому сейчас эта функция еще не готова.", {
                reply_markup: {
                    force_reply: true,
                },
            });
            
            
            

        }
        else if(msg.text == '/promo') {

            await bot.sendMessage(msg.chat.id, `Сейчас есть бот который раздает всем маленький и бесплатный бонус.\nПереходи!\n<a href="https://t.me/ivashka1305_bot">@ivashka1305_bot</a>`, { parse_mode: "HTML", disable_web_page_preview: true,});
            
            
            

        }
        else {

            //Отправляем пользователю сообщение
            const msgWait = await bot.sendMessage(msg.chat.id, `Думаю над этим...`);

            //Через 5 секунд редактируем сообщение о генерации и вставляем туда сообщение пользователя (эхо-бот)
            setTimeout(async () => {

                await bot.editMessageText(msg.text, {

                    chat_id: msgWait.chat.id,
                    message_id: msgWait.message_id

                });

            }, 1000);

        }

    }
    catch(error) {

        console.log(error);

    }

})


//Обрабатываем коллбеки на инлайн-клавиатуре
bot.on('callback_query', async ctx => {

    try {

        switch(ctx.data) {
            //Кнопка закрытия меню удаляет сообщение с меню и сообщение, по которому было вызвано меню
            case "closeMenu":

                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                await bot.deleteMessage(ctx.message.reply_to_message.chat.id, ctx.message.reply_to_message.message_id);
                break;
           
            case "breakFast":

                var categoryId = 34;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'breakFast'}],
                            ]
        
                        }
        
                    })
                }, 1000);
            
                break;
                  
            case "coldSnack":
                var categoryId = 35;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'coldSnack'}],
                            ]
        
                        }
        
                    })
                }, 1000);
            
                
                break;
            case "soups":

                var categoryId = 36;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'soups'}],
                            ]
        
                        }
        
                    })
                }, 1000);
                

                break;
            case "desserts":

                var categoryId = 37;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'desserts'}],
                            ]
        
                        }
        
                    })
                }, 1000);

                break;
            case "secondFast":

                var categoryId = 38;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'secondFast'}],
                            ]
        
                        }
        
                    })
                }, 1000);
                

                break;
            case "drinks":

                var categoryId = 39;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'drinks'}],
                            ]
        
                        }
        
                    })
                }, 1000);

                break;
            case "hotSnack":

                var categoryId = 40;
                var pathToRecipeImage = `https://app.ivinsight.ru/uploads/recipes/`
                var response = await axios.get(`https://app.ivinsight.ru/api/fetchRecipesByCategory/ru/${categoryId}/100`);
                var data = response.data;

                var getRandom = data.data[Math.floor(Math.random() * data.data.length)];
                console.log(getRandom);
                var image = pathToRecipeImage + getRandom.image;
                
                bot.sendMessage(ctx.message.chat.id, `Выбрал для тебя случайный рецепт`);
                bot.sendMessage(ctx.message.chat.id, `<b>${getRandom.name}</b>`, {parse_mode: "HTML"});
                await bot.sendPhoto(ctx.message.chat.id, image);
                
                setTimeout(async () => {
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Ингредиенты</i></b>\n${getRandom.ingredients}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Этапы приготовления</i></b>\n${getRandom.steps}`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `<b><i>Пищевая ценность</i></b>\nВремя приготовления: ${getRandom.duration} мин.\nКалорийность: ${getRandom.noOfServing}/100гр\nБелки: ${getRandom.protein}/100гр\nЖиры: ${getRandom.fats}/100гр\nУглеводы: ${getRandom.carbohydrates}/100гр\n`, {parse_mode: "HTML"});
                    await bot.sendMessage(ctx.message.chat.id, `Все рецепты есть на моем сайте <a href="https://ivinsight.ru" target="_blank">IVINSIGHT.RU</a>`, {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                        disable_notification: true
                    });
                    await bot.sendMessage(ctx.message.chat.id, `Еще рецепт?`, {

                        reply_markup: {
                            //Добавляем инлайн-клавиатуру
                            inline_keyboard: [
                                [{text: 'Нет', callback_data: 'closeMenu'}],
                                [{text: 'Да', callback_data: 'hotSnack'}],
                            ]
        
                        }
        
                    })
                }, 1000);

                break;

        }

    }
    catch(error) {

        console.log(error);

    }

})


//Ловим ошибки polling'a
bot.on("polling_error", err => console.log(err.data.error.message));
const {Telegraf, session, Markup, Scenes: {WizardScene, Stage}} = require('telegraf');
require('dotenv').config();
const helps = require('./variables');
const count = require('./counter');
const randomizer = require('./random');
const bot = new Telegraf(process.env.token);

bot.start((ctx) => ctx.reply(`Привіт @${ctx.from.username || Незнайомець}`));

bot.help((ctx) => ctx.reply(helps.commands));

const membersHandler = Telegraf.on('message', async ctx => {
    randomizer.random.setVictims(ctx.message.text)
    await ctx.reply(`Жертви: ${ctx.message.text}`);
    return ctx.scene.leave()
})

const memberHandler = Telegraf.on('message', async ctx => {
    randomizer.random.setCurrentVictim(ctx.message.text)
    await ctx.reply(`Активна жертва: ${randomizer.random.currentVictim}`);
    return ctx.scene.leave()
})

const victimsScene = new WizardScene('victimsScene', membersHandler)

const victimScene = new WizardScene('victimScene', memberHandler)

victimsScene.enter(ctx => ctx.reply('Введіть імена жертв'))

victimScene.enter(ctx => ctx.reply(`Введіть ім'я`))

const stage = new Stage([victimsScene, victimScene])

bot.use(session(), stage.middleware())

bot.command('time', async (ctx) => {
    try {
        await ctx.replyWithHTML(`<b> До наступної зустрічі залишилося: ${count.counter}</b>`)
    } catch (e) {
        console.log(e)
    }
})

bot.command('chose', async (ctx) => {
    try {
        if (randomizer.random.victims.length < 2) {
            await ctx.reply('Спочатку додайте потенційних жертв')
            return
        }
        // await isAdmin(ctx);
        randomizer.random.setCandidates()
        await ctx.reply('Початок вибору жертви на наступний місяць.')
        await ctx.reply(`Жертва попереднього місяця - ${randomizer.random.currentVictim
        || 'Відсутня'}`)
        setTimeout(() => {
            ctx.reply('Ймовірність вибору жертв:')
        }, 1000)
        setTimeout(async () => {
            await ctx.reply(randomizer.random.printCandidates())
        }, 1500)
        setTimeout(async () => {
            await ctx.reply(`Нова жертва: ${randomizer.random.setCurrentVictim()}`)
        }, 2000)
    } catch (e) {
        console.log(e)
    }

});

bot.command('add', async (ctx) => {
    try {
        await isAdmin(ctx);
        await ctx.scene.enter('victimsScene')
    } catch (e) {
        console.log(e)
    }

});

bot.command('set', async (ctx) => {
    try {
        await isAdmin(ctx);
        await ctx.scene.enter('victimScene')
    } catch (e) {
        console.log(e)
    }

});

bot.command('current', async (ctx) => {
    try {
        await ctx.reply(`Жертва місяця - ${randomizer.random.currentVictim
        || 'Відсутня'}`);
        await ctx.reply(`Жертви: ${randomizer.random.victims || 'Порожньо'}`);
    } catch (e) {
        console.log(e)
    }

});

bot.command('clear', async (ctx) => {
    try {
        await isAdmin(ctx);
        randomizer.random.currentVictim = '';
        randomizer.random.victims = [];
        await ctx.reply(`Жертви очищені`);
    } catch (e) {
        console.log(e)
    }

});


bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

async function isAdmin(ctx) {
    let admin = '';
    try {
        admin = await ctx.telegram.getChatAdministrators(ctx.chat.id)
    } catch (e) {
        // console.log(e)
    }
    let access = undefined
    if (admin) {
        access = admin.find((user) => {
            return user?.user?.id === ctx.from.id
        })
    }
    if (!access) {
        await ctx.reply("Недостатньо прав :( ")
        throw new Error('Access error')
    }
}

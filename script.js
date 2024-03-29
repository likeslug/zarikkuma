window.focus();
enchant();

let userAgent = window.navigator.userAgent.toLowerCase();
let browser_type = "";
if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
    browser_type = "ie";
} else if(userAgent.indexOf('edge') != -1) {
    browser_type = "eg";
} else if(userAgent.indexOf('chrome') != -1) {
    browser_type = "ch";
} else if(userAgent.indexOf('safari') != -1) {
    browser_type = "sf";
} else if(userAgent.indexOf('firefox') != -1) {
    browser_type = "fx";
} else if(userAgent.indexOf('opera') != -1) {
    browser_type = "op";
}
//console.log(browser_type);
function text_actualY(virtualY, font_size){ return (virtualY - (browser_type == "sf"? font_size / 3.8 : 0)); } // TODO: magic number
function text_virtualY(actualY, font_size){ return (actualY + (browser_type == "sf"? font_size / 3.8 : 0)); }

window.onload = function() {

    const GAME_WIDTH = 960;
    const GAME_HEIGHT = 540;
    const GAME_FPS = 30;
    const GAME_MAME_MAX = 5;
    const GAME_TIME = 30; // [sec]
    const IMG_TEST = 'image/pattern64.png';
    const IMG_BACKGROUND = 'image/background.png';
    const IMG_TITLE = 'image/title.png';
    const IMG_WAVE_FRAMES = 'image/wave(960x170).png';
    const IMG_STATIC = 'image/stage_static.png';
    const IMG_ANKIMO_BODY = 'image/ankimo_body(78x119).png';
    const IMG_ANKIMO_LEGS = 'image/ankimo_legs.png';
    const IMG_ANKIMO_LHAND = 'image/ankimo_lhand.png';
    const IMG_ANKIMO_RHAND = 'image/ankimo_rhand.png';
    const IMG_ROD = 'image/rod.png';
    const IMG_STRING = 'image/string.png';
    const IMG_CURVED_STRING = 'image/curved_string.png';
    const IMG_MAME = 'image/mame.png';
    const IMG_ZARI0 = 'image/zarigani0(121x91).png';
    const IMG_ZARI1 = 'image/zarigani1(140x117).png';
    const IMG_ZARI2 = 'image/zarigani2(148x126).png';
    const IMG_ZARI3 = 'image/zarigani3(115x110).png';
    const IMG_ZARI4 = 'image/zarigani4(95x127).png';
    const IMG_ZARI5 = 'image/zarigani5(124x130).png';
    const IMG_ZARI6 = 'image/zarigani6(90x90).png'
    const IMG_ZARI7 = 'image/zarigani7(60x60).png'
    const IMG_MAMEINC_BALLOON = 'image/mame_inc_balloon.png';
    const IMG_MAMEINC_TEXT = 'image/mame_inc_text.png';
    const IMG_TAIRYO_TAI = 'image/textimg_tairyo(tai).png';
    const IMG_TAIRYO_RYO = 'image/textimg_tairyo(ryo).png';
    const IMG_RESULT_FRAME = 'image/result_frame.png';
    const IMG_TIMER_ICON = 'image/timer_icon.png';
    const IMG_VE = 'image/ve_balloon.png';

    var game = new Core(GAME_WIDTH, GAME_HEIGHT);
    game.fps = GAME_FPS;
    game.rootScene.backgroundColor = '#ffffff';
    game.preload(IMG_TEST);
    game.preload([IMG_BACKGROUND]);
    game.preload([IMG_TITLE]);
    game.preload([IMG_WAVE_FRAMES]);
    game.preload([IMG_STATIC]);
    game.preload([IMG_ANKIMO_BODY, IMG_ANKIMO_LEGS, IMG_ANKIMO_LHAND, IMG_ANKIMO_RHAND]);
    game.preload([IMG_ROD]);
    game.preload([IMG_STRING, IMG_CURVED_STRING]);
    game.preload([IMG_MAME]);
    game.preload([IMG_ZARI0, IMG_ZARI1, IMG_ZARI2, IMG_ZARI3, IMG_ZARI4, IMG_ZARI5, IMG_ZARI6, IMG_ZARI7]);
    game.preload([IMG_MAMEINC_BALLOON, IMG_MAMEINC_TEXT]);
    game.preload([IMG_TAIRYO_TAI, IMG_TAIRYO_RYO]);
    game.preload([IMG_RESULT_FRAME]);
    game.preload([IMG_TIMER_ICON]);
    game.preload([IMG_VE]);

    var TitleScene = Class.create(Scene,{
        initialize: function() {
            Scene.call(this);

            let bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
            bg.image = game.assets[IMG_BACKGROUND];
            bg.moveTo(0, 0);
            this.addChild(bg);
            
            let zarigani = new Sprite(90, 90);
            zarigani.image = game.assets[IMG_ZARI6];
            zarigani.moveTo(640, 370);
            zarigani.scaleX = -1;
            zarigani.scaleY = 1;
            zarigani.frame = 2;
            this.addChild(zarigani);

            let title = new Sprite(560, 178);
            title.image = game.assets[IMG_TITLE];
            title.moveTo((GAME_WIDTH - title.width) / 2, (GAME_HEIGHT - title.height) / 2);
            this.addChild(title);

            let ankimo = new Ankimo();
            ankimo.state = Ankimo.STATE.STOP;
            ankimo.rod.string.scaleY = 35;
            ankimo.moveTo(440, 125);
            this.addChild(ankimo);

            let message = new OutlineLabel('tap to start!', GAME_WIDTH, 50, 'black', 'white', undefined, 'center');
            message.moveTo(0, 450);
            this.addChild(message);

        },
        ontouchend: function(param){
            game.replaceScene(new GameScene());
        },
    });

    var GameScene = Class.create(Scene,{
        initialize: function(){
            Scene.call(this);
            this.state = GameScene.STATE.OPENING;
            this.point = 0;
            this.start_frame = 0;

            this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
            this.bg.image = game.assets[IMG_BACKGROUND];
            this.bg.moveTo(0, 0);
            this.addChild(this.bg);

            this.warning_sheet = new Sprite(GAME_WIDTH, GAME_HEIGHT);
            this.warning_sheet.backgroundColor = 'red';
            this.warning_sheet.opacity = 0;
            this.warning_sheet.moveTo(0, 0);
            this.addChild(this.warning_sheet);

            this.bg2 = new Sprite(960, 282);
            this.bg2.image = game.assets[IMG_STATIC];
            this.bg2.moveTo(0, 0);
            this.addChild(this.bg2);

            this.ankimo = new Ankimo();
            this.ankimo.moveTo(150, 90);
            this.addChild(this.ankimo);

            this.wave = new Wave();
            this.wave.moveTo(0, 100);
            this.addChild(this.wave);

            this.point_label = new PointLabel();
            this.point_label.moveTo(0, 10);
            this.addChild(this.point_label);

            this.timer_icon = new Sprite(50, 50);
            this.timer_icon.image = game.assets[IMG_TIMER_ICON];
            this.timer_icon.moveTo(390, 8);
            this.addChild(this.timer_icon);

            this.timer_label = new TimerLabel();
            this.timer_label.moveTo(410, 10);
            this.addChild(this.timer_label);

            this.listen_startToWait();
            let gamescene = this;
            let readystart = new ReadyStartEffect(function(){
                gamescene.state = GameScene.STATE.PLAYING;
                gamescene.start_frame = gamescene.age;
            });
            readystart.moveTo((GAME_WIDTH - 400) / 2, (GAME_HEIGHT - 100) / 2);
            this.addChild(readystart);
        },
        listen_rodup: function(){

        },
        listen_gotFish: function(){
            this.wave.setFishup();

            let got_point = 0;
            let got_zari_count = 0;
            for(let i = 0; i < GAME_MAME_MAX; i++){
                let zari = this.ankimo.rod.mames[i].having_zari;
                if(zari){
                    got_point += zari.point;
                    got_zari_count++;
                }
            }
            let score_effect = new GetScoreEffect(got_point);
            score_effect.moveTo(200, 100);
            this.addChild(score_effect);
            this.point_label.addPoint(this.point, this.point + got_point);
            this.point += got_point;
            if(got_zari_count == 0){
                this.ankimo.disappoint();
            }
            else if(this.ankimo.rod.mame_count < GAME_MAME_MAX && got_zari_count == this.ankimo.rod.mame_count){
                let tairyo = TairyoEffect();
                tairyo.moveTo(GAME_WIDTH / 2, GAME_HEIGHT / 2);
                this.addChild(tairyo);
                let mameinc = MameIncEffect();
                mameinc.moveTo(GAME_WIDTH / 2, GAME_HEIGHT * 13 / 16);
                this.addChild(mameinc);

                if(this.ankimo.rod.mame_count < GAME_MAME_MAX) this.ankimo.rod.mame_count++;
            }
        },
        listen_startToWait: function(){
            for(let i = 0; i < GAME_MAME_MAX; i++){
                this.ankimo.rod.mames[i].removeZari();
            }
            this.wave.setNormal();
        },
        ontouchend: function(param){
            if(this.state == GameScene.STATE.PLAYING)
            {
                this.ankimo.fishup();
            }
            else if(this.state == GameScene.STATE.LEAVEABLE)
            {
                let remain_zaris = ZariBase.collection;
                for(let i = remain_zaris.length - 1; i >= 0; i--){
                    remain_zaris[i].parentNode.removeChild(remain_zaris[i]);
                }
                game.replaceScene(new TitleScene());
            }
        },
        onenterframe: function(){
            switch (this.state) {
                case GameScene.STATE.OPENING:
                    break;
                case GameScene.STATE.PLAYING:
                    {
                        let remain_sec = GAME_TIME - (this.age - this.start_frame) / GAME_FPS;
                        this.timer_label.updateTime(remain_sec, this.warning_sheet);
                        if(remain_sec <= 0)
                        {
                            let timeup = new TimeupEffect();
                            timeup.moveTo((GAME_WIDTH - 400) / 2, (GAME_HEIGHT - 100) / 2);
                            this.addChild(timeup);

                            this.tl.delay(80).then(function(){
                                let resultdisp = new ResultDisplay(this.point);
                                resultdisp.moveTo((GAME_WIDTH - 810) / 2, (GAME_HEIGHT - 240) / 2);
                                this.addChild(resultdisp);
                            });

                            this.state = GameScene.STATE.CLOSING;
                        }
                        else
                        {
                            // ザリガニ生成ルール
                            const MIN_ZARIGANI_COUNT = 3;
                            const MAX_ZARIGANI_COUNT = 8;
                            const ZARI_GENERATE_RATE = 15; // [frame/gen]
                            let living_zari_count = ZariBase.collection.length;
                            if(living_zari_count < MAX_ZARIGANI_COUNT)
                            {
                                if(living_zari_count < MIN_ZARIGANI_COUNT || Math.random() <= 1 / ZARI_GENERATE_RATE)
                                {
                                    let zari_gen_weight = [];
                                    zari_gen_weight[0] = (remain_sec > 25)? 2 : 0;
                                    zari_gen_weight[1] = (remain_sec <= 25)? 2 : 0;
                                    zari_gen_weight[2] = (remain_sec <= 20)? 2 : 0;
                                    zari_gen_weight[3] = (remain_sec <= 15)? 4 : 0;
                                    zari_gen_weight[4] = (remain_sec <= 15)? 1 : 0;
                                    zari_gen_weight[5] = (remain_sec <= 15)? 1 : 0;
                                    zari_gen_weight[6] = (remain_sec <= 15)? 1 : 0;
                                    zari_gen_weight[7] = (remain_sec <= 20)? 2 : 0;
                                    let total_weight = 0;
                                    for (const w of zari_gen_weight) { total_weight += w; }

                                    let zari_type = 0;
                                    let type_random = Math.random();
                                    let cumulate_weight = 0;
                                    for (zari_type = 0; zari_type < zari_gen_weight.length; zari_type++){
                                        cumulate_weight += zari_gen_weight[zari_type];
                                        if(type_random < cumulate_weight / total_weight) break;
                                    }

                                    const WAVE_Y = 250;
                                    let zari_entity;
                                    switch (zari_type) {
                                        default:
                                        case 0:
                                            zari_entity = new Zari0();
                                            zari_entity.moveTo(-zari_entity.width, WAVE_Y + Math.random() * (GAME_HEIGHT - WAVE_Y - zari_entity.height));
                                            break;
                                        case 1:
                                            zari_entity = new Zari1();
                                            zari_entity.moveTo(-zari_entity.width, WAVE_Y + Math.random() * (GAME_HEIGHT - WAVE_Y - zari_entity.height));
                                            break;
                                        case 2:
                                            zari_entity = new Zari2();
                                            zari_entity.moveTo(-zari_entity.width, GAME_HEIGHT - zari_entity.height + 5);
                                            break;
                                        case 3:
                                            zari_entity = new Zari3();
                                            zari_entity.moveTo(-zari_entity.width, WAVE_Y + Math.random() * (GAME_HEIGHT - WAVE_Y - zari_entity.height));
                                            break;
                                        case 4:
                                            zari_entity = new Zari4();
                                            zari_entity.moveTo(-zari_entity.width, GAME_HEIGHT - zari_entity.height + 5);
                                            break;
                                        case 5:
                                            zari_entity = new Zari5();
                                            zari_entity.moveTo(-zari_entity.width, WAVE_Y + Math.random() * (GAME_HEIGHT - WAVE_Y - zari_entity.height - 30));
                                            break;
                                        case 6:
                                            zari_entity = new Zari6();
                                            zari_entity.moveTo(-zari_entity.width, WAVE_Y + Math.random() * (GAME_HEIGHT - WAVE_Y - zari_entity.height));
                                            break;
                                        case 7:
                                            zari_entity = new Zari7();
                                            zari_entity.moveTo(-zari_entity.width, WAVE_Y + Math.random() * (GAME_HEIGHT - WAVE_Y - zari_entity.height));
                                            break;
                                    }
                                    this.insertBefore(zari_entity, this.wave);
                                }
                            }
                        }
                    }
                    break;
                case GameScene.STATE.CLOSING:
                    this.tl.delay(2 * GAME_FPS).then(function(){
                        this.state = GameScene.STATE.LEAVEABLE;
                    });
                    break;
                case GameScene.STATE.LEAVEABLE:
                default:
                    break;
            }
        },
    });
    GameScene.STATE = { OPENING : 0, PLAYING : 1, CLOSING : 2, LEAVEABLE : 3, };

    var Wave = Class.create(Sprite,{
        initialize: function(){
            Sprite.call(this, 960, 170);
            this.image = game.assets[IMG_WAVE_FRAMES];
        },
        setNormal: function(){
            const N = 8;
            this.frame = (Array(N).fill(0)).concat(Array(N).fill(1)).concat(Array(N).fill(2)).concat(Array(N).fill(3));
        },
        setFishup: function(){
            const N = 3;
            this.frame = (Array(N).fill(4)).concat(Array(N).fill(5)).concat(Array(N).fill(6)).concat(Array(N).fill(7)).concat(Array(N).fill(8)).concat([null]);
        },
    });

    var Ankimo = Class.create(Group,{
        initialize: function(){
            Group.call(this);
            this.state = Ankimo.STATE.WAITING_INIT;

            this.lhand = new Sprite(30, 29);
            this.lhand.image = game.assets[IMG_ANKIMO_LHAND];
            this.lhand.originX = 1;
            this.lhand.originY = 22;
            this.lhand.moveTo(55, 55);
            this.lhand.rotate(-15);
            this.addChild(this.lhand);

            this.body = new Sprite(78, 119);
            this.body.image = game.assets[IMG_ANKIMO_BODY];
            this.body.originX = 17;
            this.body.originY = 114;
            this.body.moveTo(0, 0);
            this.addChild(this.body);

            this.rod = new Rod(this);
            this.rod.originX = 2;
            this.rod.originY = 146;
            this.rod.moveTo(40, -50);
            this.addChild(this.rod);

            this.legs = new Sprite(66, 30);
            this.legs.image = game.assets[IMG_ANKIMO_LEGS];
            this.legs.moveTo(17, 90);
            this.addChild(this.legs);

            this.rhand = new Sprite(35, 21);
            this.rhand.image = game.assets[IMG_ANKIMO_RHAND];
            this.rhand.originX = 2;
            this.rhand.originY = 7;
            this.rhand.moveTo(23, 70);
            this.addChild(this.rhand);
        },
        onenterframe: function(){
            switch (this.state) {
                case Ankimo.STATE.WAITING_INIT:
                default:
                    this.body.frame = 0;
                    this.body.tl.clear();
                    this.body.rotation = 0;
                    this.rod.rotation = 0;
                    this.lhand.rotation = 0;
                    this.rhand.rotation = 0;
                    this.body.tl.rotateTo(-1, 30).rotateTo(2, 30).loop();
                    this.state = Ankimo.STATE.WAITING;
                case Ankimo.STATE.WAITING:
                    break;
                case Ankimo.STATE.RAISING_INIT:
                    this.body.tl.clear();
                    this.body.tl.rotateTo(-5, 10).delay(30).then(function(){
                        this.parentNode.state = Ankimo.STATE.WAITING_INIT;
                    });
                    this.rod.tl.rotateTo(-10, 10);
                    this.lhand.tl.rotateTo(-20, 10);
                    this.rhand.tl.rotateTo(-10, 10);
                    this.state = Ankimo.STATE.RAISING;
                case Ankimo.STATE.RAISING:
                    break;
                case Ankimo.STATE.STOP:
                    break;
            }
        },
        fishup: function(){
            this.rod.rollup();
        },
        onRodRolledup: function(){
            if(this.state == Ankimo.STATE.WAITING)
            {
                this.state = Ankimo.STATE.RAISING_INIT;
            }
        },
        disappoint: function(){
            this.body.frame = 1;
            this.ve_balloon = new Sprite(71, 64);
            this.ve_balloon.image = game.assets[IMG_VE];
            this.ve_balloon.moveTo(-this.ve_balloon.width - 10, -20);
            this.ve_balloon.on('enterframe', function(){
                if(this.parentNode.state == Ankimo.STATE.WAITING_INIT || this.parentNode.state == Ankimo.STATE.WAITING) this.parentNode.removeChild(this);
            });
            this.addChild(this.ve_balloon);
        }
    });
    Ankimo.STATE = {
        WAITING_INIT        : 0,
        WAITING             : 1,
        RAISING_INIT        : 2,
        RAISING             : 3,
        STOP                : 4,
    };

    var Rod = Class.create(Group,{
        MAX_STRING_LENGTH : 480,
        initialize: function(owner){
            Group.call(this);
            this.state = Rod.STATE.WAITING;
            this.mame_count = 2;
            this.owner = owner;
            
            this.string = new Sprite(7, 10);
            this.string.image = game.assets[IMG_STRING];
            this.string.originX = 3;
            this.string.originY = 0;
            this.string.moveTo(95, 2);
            this.string.visible = false;
            this.addChild(this.string);

            this.curved_string = new Sprite(159, 151);
            this.curved_string.image = game.assets[IMG_CURVED_STRING];
            this.curved_string.originX = 0;
            this.curved_string.originY = 0;
            this.curved_string.moveTo(95, 0);
            this.curved_string.visible = false;
            this.addChild(this.curved_string);

            this.rodbody = new Sprite(101, 148);
            this.rodbody.image = game.assets[IMG_ROD];
            this.rodbody.originX = 1;
            this.rodbody.originY = 145;
            this.rodbody.moveTo(0, 0);
            this.addChild(this.rodbody);

            this.mames = [];
            for(let i = 0; i < GAME_MAME_MAX; i++)
            {
                let mame = new Mame(this, i);
                mame.scaleX = (i % 2)? 1 : -1;
                this.mames.push(mame);
                this.addChild(mame);
            }

            this._initPosition();
        },
        _initPosition: function(){
            this.curved_string.visible = false;
            this.string.visible = true;
            this.string.scaleY = this.MAX_STRING_LENGTH / this.string.height;
        },
        rollup: function(){
            if(this.state == Rod.STATE.WAITING)
            {
                this.state = Rod.STATE.ROLLING_UP;
                this.scene.listen_rodup();
                this.curved_string.visible = false;
                this.string.visible = true;
                this.string.scaleY = this.MAX_STRING_LENGTH / this.string.height;
                this.string.tl.scaleTo(this.string.scaleX, 200 / this.string.height, 45);
                this.string.tl.then(function(){
                    this.parentNode.state = Rod.STATE.ROLLED_UP;
                    this.scene.listen_gotFish();
                    this.visible = false;
                    this.parentNode.curved_string.visible = true;
                    this.parentNode.owner.onRodRolledup();
                });
                this.string.tl.delay(40);
                this.string.tl.then(function(){
                    this.parentNode.state = Rod.STATE.WAITING;
                    this.scene.listen_startToWait();
                    this.parentNode._initPosition();
                });
            }
        },
        onenterframe: function(){
            if(this.state == Rod.STATE.ROLLING_UP){
                let fished_zari_list = [];
                for(let mame_i = 0; mame_i < GAME_MAME_MAX; mame_i++){
                    if(this.mames[mame_i].mamebody.visible && this.mames[mame_i].having_zari == undefined){
                        this.mames[mame_i].mamebody.intersect(ZariBase).forEach(function(zari){
                            if(zari.active && fished_zari_list.indexOf(zari) < 0){
                                fished_zari_list.push(zari);
                            }
                        });
                    }
                }
                for(let fzari_i = 0; fzari_i < fished_zari_list.length; fzari_i++)
                {
                    let free_mame = undefined;
                    for(let mame_i = 0; mame_i < this.mame_count; mame_i++){
                        if(this.mames[mame_i].having_zari == undefined){
                            free_mame = this.mames[mame_i];
                            break;
                        }
                    }
                    if(free_mame != undefined){
                        fished_zari_list[fzari_i].fish();
                        fished_zari_list[fzari_i].scene.removeChild(fished_zari_list[fzari_i]);
                        free_mame.attachZari(fished_zari_list[fzari_i]);
                    }
                }
            }
        }
    });
    Rod.STATE = { WAITING: 1, ROLLING_UP: 3, ROLLED_UP: 5, };

    var Mame = Class.create(Group,{
        initialize: function(rod, no){
            Group.call(this);
            this.no = no;
            this.rod = rod;
            this.having_zari = undefined;
            this.originX = 43;
            this.originY = 17;
            this.mamebody = new Sprite(46, 41);
            this.mamebody.image = game.assets[IMG_MAME];
            this.mamebody.originX = this.originX;
            this.mamebody.originY = this.originY;
            this.mamebody.moveTo(0, 0);
            this.addChild(this.mamebody);
        },
        onenterframe: function(){
            if(this.no >= this.rod.mame_count)
            {
                this.mamebody.visible = false;
            }
            else
            {
                this.mamebody.visible = true;
                if(this.rod.state == Rod.STATE.WAITING || this.rod.state == Rod.STATE.ROLLING_UP)
                {
                    let string_bottom = this.rod.string.y + this.rod.string.height * this.rod.string.scaleY;
                    this.moveTo(this.mamebody.width + 9, string_bottom - 23 - 20 * this.no);
                    this.rotation = 0;
                }
                else if(this.rod.state == Rod.STATE.ROLLED_UP)
                {
                    switch (this.no) {
                        case 0: this.moveTo(208, 130); this.rotation =  0; break;
                        case 1: this.moveTo(200, 110); this.rotation =-15; break;
                        case 2: this.moveTo(190,  80); this.rotation =-32; break;
                        case 3: this.moveTo(180,  60); this.rotation =-20; break;
                        case 4: this.moveTo(165,  40); this.rotation =-55; break;
                    };
                }
            }
        },
        attachZari: function(zari){
            zari.scaleX = 1;
            zari.scaleY = 1;
            zari.rotation = -45 - zari.bodyAngle;
            zari.moveTo(12 - zari.originX, 10 - zari.originY);
            this.insertBefore(zari, this.mamebody);
            this.having_zari = zari;
        },
        removeZari: function(){
            let ret = this.having_zari;
            this.removeChild(this.having_zari);
            this.having_zari = undefined;
            return ret;
        }
    });

    var ZariBase = Class.create(Sprite,{
        initialize: function(width, height, image, originX, originY, bodyAngle, speedX, point){
            Sprite.call(this, width, height);
            this.image = game.assets[image];
            this.originX = originX;
            this.originY = originY;
            this.bodyAngle = bodyAngle;
            this.abs_speedX = speedX;
            this.direction = 1;
            this.frame = (Array(4).fill(0)).concat(Array(4).fill(1));
            this.point = point;
            this.active = true;
        },
        onenterframe: function(){
            if(this.active){
                if(this.x + this.width / 2 <= 0 && this.direction < 0){
                    this.direction = 1;
                    this.scaleX = 1;
                }else if(this.x + this.width / 2 >= GAME_WIDTH && this.direction > 0){
                    this.direction = -1;
                    this.scaleX = -1;
                }
                this.x += this.direction * this.abs_speedX;
            }
        },
        fish: function(){
            this.frame = 0;
            this.active = false;
        }
    });
    var Zari0 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 121, 91, IMG_ZARI0, 78, 29, -15, 5, 1000);
        }
    });
    var Zari1 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 140, 117, IMG_ZARI1, 105, 40, 0, 12, 5000);
        }
    });
    var Zari2 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 148, 126, IMG_ZARI2, 97, 52, -30, 5, 10000);
        }
    });
    var Zari3 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 115, 110, IMG_ZARI3, 79, 53, 0, 15, 50000);
        }
    });
    var Zari4 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 95, 127, IMG_ZARI4, 50, 20, -90, 30, 80000);
        },
        onenterframe: function(){
            if(this.active){
                this.x += this.direction * this.abs_speedX;
                if(this.x >= GAME_WIDTH)
                {
                    this.parentNode.removeChild(this);
                }
            }
        }
    });
    var Zari5 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 124, 130, IMG_ZARI5, 85, 18, -65, 15, 60000);
            this.y0 = 0;
        },
        moveTo: function(x, y){
            ZariBase.prototype.moveTo.call(this, x, y);
            this.age0 = this.age;
            this.y0 = y;
        },
        onenterframe: function(){
            if(this.active){
                this.x += this.direction * this.abs_speedX;
                this.y = this.y0 + 30 * Math.sin((this.age - this.age0) * Math.PI / 10);
                if(this.x >= GAME_WIDTH)
                {
                    this.parentNode.removeChild(this);
                }
            }
        }
    });
    var Zari6 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 90, 90, IMG_ZARI6, 70, 34, -50, 5, 100000);
            this.status = 0;
            this.bite_count = 0;
        },
        onenterframe: function(){
            if(this.active){
                const STRING_X = 250;
                stop_x = STRING_X - this.width / 2 - 60;
                bite_x = STRING_X - this.width / 2;
                switch(this.status)
                {
                    case 0: // entry 
                        this.frame = 0;
                        this.x += this.direction * this.abs_speedX;
                        if(this.x >= stop_x) { this.x = stop_x; this.status = 1; }
                        break;
                    case 1: // bite_ready 
                    default:
                        this.frame = 1;
                        this.x = stop_x;
                        if(Math.random() < 0.02)
                        {
                            if(this.bite_count >= 2 || Math.random() < 0.5)
                            {
                                this.status = 3;
                            }
                            else
                            {
                                this.status = 2;
                                this.bite_count++;
                                this.tl.moveTo(bite_x, this.y, 5, enchant.Easing.QUAD_EASEIN).moveTo(stop_x, this.y, 5, enchant.Easing.QUAD_EASEOUT).then(function(){this.status = 1});
                            }
                        }
                        break;
                    case 2: // biting 
                        break;
                    case 3: // escaping 
                        this.frame = 0;
                        this.x += this.direction * this.abs_speedX * 10;
                        break;
                }
                
                if(this.x >= GAME_WIDTH) this.parentNode.removeChild(this);
            }
        },
        fish: function(){
            this.tl.clear();
            this.frame = 2;
            this.active = false;
        }
    });
    var Zari7 = Class.create(ZariBase,{
        initialize: function(){
            ZariBase.call(this, 60, 60, IMG_ZARI7, 39, 14, -50, 5, 3000);
        }
    });

    var OutlineLabel = Class.create(Group,{
        initialize: function(initial_text, width, size_px, fg_color, bg_color, bg2_color, align = 'right'){
            Group.call(this);
            this.BG_SHIFT_COUNT = 16;
            this.BG_SHIFT_PIX = size_px / 10;
            this.font_size = size_px;
            let font = "800 " + size_px + "px 'Nunito', sans-serif";
            
            this.bg2_labels = [];
            if(bg2_color != undefined)
            {
                for(let i = 0; i < this.BG_SHIFT_COUNT; i++)
                {
                    let bg_label = new Label(initial_text);
                    bg_label.font = font;
                    bg_label.color = bg2_color;
                    bg_label.textAlign = align;
                    bg_label.width = width;
                    let rad = (2 * Math.PI) * (i / this.BG_SHIFT_COUNT);
                    bg_label.moveTo((this.BG_SHIFT_PIX + 1) * Math.cos(rad), (this.BG_SHIFT_PIX + 1) * Math.sin(rad));
                    this.addChild(bg_label);
                    this.bg2_labels.push(bg_label);
                }
            }

            this.bg_labels = [];
            for(let i = 0; i < this.BG_SHIFT_COUNT; i++)
            {
                let bg_label = new Label(initial_text);
                bg_label.font = font;
                bg_label.color = bg_color;
                bg_label.textAlign = align;
                bg_label.width = width;
                let rad = (2 * Math.PI) * (i / this.BG_SHIFT_COUNT);
                bg_label.moveTo(this.BG_SHIFT_PIX * Math.cos(rad), this.BG_SHIFT_PIX * Math.sin(rad));
                this.addChild(bg_label);
                this.bg_labels.push(bg_label);
            }

            this.fg_label = new Label(initial_text);
            this.fg_label.font = font;
            this.fg_label.color = fg_color;
            this.fg_label.textAlign = align;
            this.fg_label.width = width;
            this.fg_label.moveTo(0, 0);
            this.addChild(this.fg_label);
        },
        setText: function(text){
            for(let i = 0; i < this.bg2_labels.length; i++) this.bg2_labels[i].text = text;
            for(let i = 0; i < this.bg_labels.length; i++) this.bg_labels[i].text = text;
            this.fg_label.text = text;
        },
        setFgColor: function(color){
            this.fg_label.color = color;
        },
        y: {
            // あまりよくない… 
            get: function() {
                return text_virtualY(this._y, this.font_size);
            },
            set: function(y) {
                y = text_actualY(y, this.font_size);
                if(this._y !== y) {
                    this._y = y;
                    this._dirty = true;
                }
            }
        },
        opacity: {
            get: function() {
                return this.fg_label.opacity;
            },
            set: function(opacity) {
                if(0){
                    // TODO 消え方汚い 
                    for(let i = 0; i < this.bg2_labels.length; i++) this.bg2_labels[i].opacity = opacity;
                    for(let i = 0; i < this.bg_labels.length; i++) this.bg_labels[i].opacity = opacity;
                    this.fg_label.opacity = opacity;
                }
            }
        }
    });
    var PointLabel = Class.create(OutlineLabel,{
        initialize: function(){
            OutlineLabel.call(this, '0 pt', 300, 54, 'black', 'white', undefined);
        },
        addPoint: function(from_point, to_point){
            const FRAME_COUNT = 5;
            diff_point = (to_point - from_point) / FRAME_COUNT;
            for(let n = 0; n < FRAME_COUNT; n++){
                this.tl.delay(1).then(function(){
                    this.setText(parseInt(from_point + diff_point * n) + ' pt');
                });
            }
            this.tl.delay(1).then(function(){
                this.setText(parseInt(to_point) + ' pt');
            });
        }
    });
    var TimerLabel = Class.create(OutlineLabel,{
        initialize: function(){
            OutlineLabel.call(this, '' + GAME_TIME, 100, 54, 'black', 'white', undefined);
            this.float_sec = GAME_TIME;
            this.originX = 85;
            this.originY = 27;
        },
        updateTime: function(sec, warning_sheet){
            let current_int_sec = parseInt(this.float_sec);
            let next_int_sec = parseInt(sec);
            if(current_int_sec != next_int_sec){
                if(next_int_sec > 0 && next_int_sec < 10){
                    this.setFgColor('#ff534f');
                    this.tl.scaleTo(1.3, 1.3, 8).scaleTo(1, 1, 15);
                    warning_sheet.tl.fadeTo(0.5, 8).fadeTo(0.0, 15);
                }else{
                    this.setFgColor('black');
                    this.scaleX = this.scaleY = 1;
                    warning_sheet.opacity = 0;
                }
                this.float_sec = sec;
                this.setText(next_int_sec);
            }
        }
    });

    var ReadyStartEffect = Class.create(OutlineLabel, {
        initialize: function(start_function){
            OutlineLabel.call(this, 'Ready', 400, 100, 'white', 'black', 'white', 'center');
            this.originX = 400 / 2;
            this.originY = 100 / 2;
            this.scaleX = this.scaleY = 0.6;
            this.tl.scaleTo(1.0, 1.0, 8).delay(20).scaleTo(1.8, 1.8, 8).then(function(){
                this.scaleX = this.scaleY = 1;
                this.setText('Start!!');
                start_function();
            }).delay(20).scaleTo(1.8, 1.8, 8).then(function(){
                this.parentNode.removeChild(this);
            });
        }
    });
    var GetScoreEffect = Class.create(OutlineLabel,{
        initialize: function(got_score){
            OutlineLabel.call(this, '+ ' + got_score, 300, 48, '#139f31', 'white', 'black');
            this.tl.delay(10);
            this.tl.moveBy(0, -20, 30).and().fadeOut(30);
            this.tl.then(function(){
                this.scene.removeChild(this);
            });
        }
    });
    var TairyoEffect = Class.create(Group,{
        initialize: function(){
            Group.call(this);

            this.tai = new Sprite(158, 161);
            this.tai.image = game.assets[IMG_TAIRYO_TAI];
            this.tai.originX = this.tai.width / 2;
            this.tai.originY = this.tai.height / 2;
            this.tai.moveTo(-10-this.tai.width, -this.tai.height / 2);
            this.tai.visible = false;
            this.addChild(this.tai);
            {
                this.tai.visible = true;
                this.tai.scaleX = this.tai.scaleY = 3;
                this.tai.tl.scaleTo(1, 1, 20, enchant.Easing.ELASTIC_EASEOUT);
            }

            this.ryo = new Sprite(177, 167);
            this.ryo.image = game.assets[IMG_TAIRYO_RYO];
            this.ryo.originX = this.ryo.width / 2;
            this.ryo.originY = this.ryo.height / 2;
            this.ryo.moveTo(+10, -this.ryo.height / 2);
            this.ryo.visible = false;
            this.addChild(this.ryo);
            {
                this.ryo.scaleX = this.ryo.scaleY = 3;
                this.ryo.tl.delay(10).then(function(){ this.visible = true; }).scaleTo(1, 1, 20, enchant.Easing.ELASTIC_EASEOUT);
            }

            this.tl.delay(60).then(function(){
                this.parentNode.removeChild(this);
            });
        }
    });
    var MameIncEffect = Class.create(Group,{
        initialize: function(){
            Group.call(this);

            this.backballoon = new Sprite(369, 101);
            this.backballoon.image = game.assets[IMG_MAMEINC_BALLOON];
            this.backballoon.originX = 259 / 2;
            this.backballoon.originY = 101 / 2;
            this.backballoon.moveTo(-this.backballoon.width / 2, -this.backballoon.height / 2);
            this.backballoon.on('enterframe', function(){
                if(parseInt(this.age / 4) % 2){
                    this.scaleX = this.scaleY = 1.2;
                }else{
                    this.scaleX = this.scaleY = 1.0;
                }
            });
            this.addChild(this.backballoon);

            this.front_text = new Sprite(259, 43);
            this.front_text.image = game.assets[IMG_MAMEINC_TEXT];
            this.front_text.moveTo(-this.front_text.width / 2, -this.front_text.height / 2);
            this.addChild(this.front_text);

            this.tl.delay(60).then(function(){
                this.parentNode.removeChild(this);
            });
        }
    });
    var TimeupEffect = Class.create(OutlineLabel, {
        initialize: function(){
            OutlineLabel.call(this, 'Time up!', 400, 100, 'black', 'white', 'black', 'center');
            this.originX = 400 / 2;
            this.originY = 100 / 2;
            this.scaleX = this.scaleY = 1.4;
            this.tl.scaleTo(1.0, 1.0, 10, enchant.Easing.ELASTIC_EASEOUT).delay(30).then(function(){
                this.parentNode.removeChild(this);
            });
        }
    });
    var ResultDisplay = Class.create(Group, {
        initialize: function(total_point){
            Group.call(this);
            this.total_point = total_point;
            this.disp_numbers = [];

            this.bg_frame = new Sprite(810, 240);
            this.bg_frame.image = game.assets[IMG_RESULT_FRAME];
            this.bg_frame.moveTo(0, 0);
            this.addChild(this.bg_frame);

            this.score_text = new OutlineLabel('SCORE', this.bg_frame.width, 54, 'black', 'white', undefined, 'center');
            this.score_text.moveTo(0, 25);
            this.addChild(this.score_text);
            
            this.pt_text = new OutlineLabel('pt', this.bg_frame.width, 65, 'black', 'white', undefined, 'right');
            this.pt_text.moveTo(-100, 150);
            this.addChild(this.pt_text);

            this.pt_counter = new OutlineLabel('' + total_point, this.bg_frame.width, 120, '#f3b11e', 'black', undefined, 'right');
            this.pt_counter.moveTo(-180, 110);
            this.addChild(this.pt_counter);
        },
        onenterframe: function(){
            const RANDOM_FRAMES = 30;
            if(this.age < RANDOM_FRAMES)
            {
                if(this.age % 1 == 0 || this.disp_numbers.length == 0)
                {
                    let digits = (this.total_point > 0)? Math.floor(Math.log10(this.total_point) + 1) : 1;
                    this.disp_numbers = [];
                    for(let i = 0; i < digits; i++){
                        this.disp_numbers.push(parseInt(Math.random() * 10));
                    }
                }
                this.pt_counter.setText(this.disp_numbers.join(''));
            }
            else if(this.age == RANDOM_FRAMES){
                this.pt_counter.setText('' + this.total_point);
            }
        },
    });

    function resizeStage() {
        var core = enchant.Core.instance;
        core.scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
        var stagePos = {
            top: (window.innerHeight - (core.height * core.scale)) / 2,
            left: (window.innerWidth - (core.width * core.scale)) / 2,
        };
        var stage = document.getElementById('enchant-stage');
        stage.style.position = 'absolute';
        stage.style.top = stagePos.top + 'px';
        stage.style.left = stagePos.left + 'px';
        core._pageX = stagePos.left;
        core._pageY = stagePos.top;
    }
    window.onresize = function() {
        resizeStage();
    };
    resizeStage();
    
    game.onload = function() {
        var titleScene = new TitleScene();
        game.pushScene(titleScene);
    };
    game.start();
};

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

window.Global = {
    room: null
};

cc.Class({
    extends: cc.Component,

    properties: {
        card: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        var scene = cc.director.getScene();

        var host = window.document.location.host.replace(/:.*/, '');

        var client = new Colyseus.Client(location.protocol.replace("http", "ws") + host + (location.port ? ':' + location.port : ''));
        // var client = new Colyseus.Client(location.protocol.replace("http", "ws") + host + (':2567'));
        var room = client.join("random_team");
        Global.room = room;

        room.onJoin.add(function () {
            console.log("joined");
        });

        room.onStateChange.addOnce(function (state) {
            console.log("initial room state:", state);
        });

        // new room state
        room.onStateChange.add(function (state) {
            // this signal is triggered on each patch
        });

        // listen to patches coming from the server
        room.onMessage.add(function (message) {
            console.log(message);

            if (message.action == 'show_club') {
                scene.getChildByName('Card_' + message.index).getComponent('Card').showClub(message.value);
            }
        });

        var posX = cc.winSize.width * 0.2;
        var posY = cc.winSize.height * 0.9;

        for (var i = 1; i <= 22; i++) {
            var newCard = cc.instantiate(this.card);
            newCard.active = true;
            newCard.parent = scene;
            newCard.name = 'Card_' + (i - 1);
            newCard.index = i - 1;
            newCard.setPosition(posX, posY);

            posX += newCard.getContentSize().width * 1.05;

            if (i % 6 == 0) {
                posX = cc.winSize.width * 0.2;
                posY -= newCard.getContentSize().height * 1.05;
            }
        }
    },
});

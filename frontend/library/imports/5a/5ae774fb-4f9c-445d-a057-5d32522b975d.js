"use strict";
cc._RF.push(module, '5ae77T7T5xEXaBXXTJSK5dd', 'ResultPanel');
// scripts/ResultPanel.js

'use strict';

var i18n = require('LanguageData');
i18n.init(window.language); // languageID should be equal to the one we input in New Language ID input field
cc.Class({
  extends: cc.Component,
  properties: {
    onCloseDelegate: {
      type: cc.Object,
      default: null
    },
    onAgainClicked: {
      type: cc.Object,
      default: null
    },
    myAvatarNode: {
      type: cc.Node,
      default: null
    },
    myNameNode: {
      type: cc.Node,
      default: null
    },
    rankingNodes: {
      type: [cc.Node],
      default: []
    },
    winNode: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {},
  againBtnOnClick: function againBtnOnClick(evt) {
    this.onClose();
    if (!this.onAgainClicked) return;
    this.onAgainClicked();
  },
  homeBtnOnClick: function homeBtnOnClick(evt) {
    if (null == window.mapIns) return;
    window.mapIns.clearLocalStorageAndBackToLoginScene();
  },
  showPlayerInfo: function showPlayerInfo(playerMetas) {
    this.showRanking(playerMetas);
    this.showMyAvatar();
    this.showMyName();
  },
  showMyName: function showMyName() {
    var selfPlayerInfo = JSON.parse(cc.sys.localStorage.getItem('selfPlayer'));
    var name = 'No name';
    if (null == selfPlayerInfo.displayName || "" == selfPlayerInfo.displayName) {
      name = selfPlayerInfo.name;
    } else {
      name = selfPlayerInfo.displayName;
    }
    if (!this.myNameNode) return;
    var myNameNodeLabel = this.myNameNode.getComponent(cc.Label);
    if (!myNameNodeLabel || null == name) return;
    myNameNodeLabel.string = name;
  },
  showRanking: function showRanking(playerMetas) {
    var self = this;
    var sortablePlayers = [];

    for (var playerId in playerMetas) {
      var p = playerMetas[playerId];
      p.id = playerId; //附带上id
      sortablePlayers.push(p);
    }
    var sortedPlayers = sortablePlayers.sort(function (a, b) {
      if (a.score == null) {
        //为null的必定排后面
        return 1;
      } else if (b.score == null) {
        //为null的必定排后面
        return -1;
      } else {
        if (a.score < b.score) {
          //分数大的排前面
          return 1;
        } else {
          return -1;
        }
      }
    });

    var selfPlayerInfo = JSON.parse(cc.sys.localStorage.getItem('selfPlayer'));

    var _loop = function _loop(k) {
      var p = sortedPlayers[k];
      var nameToDisplay = function () {
        function isEmptyString(str) {
          return str == null || str == '';
        }
        if (!isEmptyString(p.displayName)) {
          return p.displayName;
        } else if (!isEmptyString(p.name)) {
          return p.name;
        } else {
          return "";
        }
      }();

      if (selfPlayerInfo.playerId == p.id) {
        //如果不是第一名就不显示WIN字样
        var rank = p.id + 1;
        if (rank != 1 && null != self.winNode) {
          self.winNode.active = false;
        }
      }

      self.rankingNodes[p.id].getChildByName('name').getComponent(cc.Label).string = nameToDisplay;
      self.rankingNodes[p.id].getChildByName('score').getComponent(cc.Label).string = p.score;
    };

    for (var k in sortedPlayers) {
      _loop(k);
    }
  },
  showMyAvatar: function showMyAvatar() {
    var self = this;
    var selfPlayerInfo = JSON.parse(cc.sys.localStorage.getItem('selfPlayer'));
    var remoteUrl = selfPlayerInfo.avatar;
    if (remoteUrl == null || remoteUrl == '') {
      cc.log('No avatar to show for myself, check storage.');
      return;
    } else {
      cc.loader.load({
        url: remoteUrl,
        type: 'jpg'
      }, function (err, texture) {
        if (err != null || texture == null) {
          console.log(err);
        } else {
          var sf = new cc.SpriteFrame();
          sf.setTexture(texture);
          self.myAvatarNode.getComponent(cc.Sprite).spriteFrame = sf;
        }
      });
    }
  },
  showRibbon: function showRibbon(winnerInfo, ribbonNode) {
    var selfPlayerInfo = JSON.parse(cc.sys.localStorage.getItem('selfPlayer'));
    var texture = selfPlayerInfo.playerId == winnerInfo.id ? "textures/resultPanel/WinRibbon" : "textures/resultPanel/loseRibbon";
    cc.loader.loadRes(texture, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err);
        return;
      }
      ribbonNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
  },
  onClose: function onClose(evt) {
    if (this.node.parent) {
      this.node.parent.removeChild(this.node);
    }
    if (!this.onCloseDelegate) {
      return;
    }
    this.onCloseDelegate();
  }
});

cc._RF.pop();
/**
 * Created by Pascal on 04.03.2016.
 */

define(['jquery', 'webix', 'settingsLoader', 'studentNickname'], function ($, webix, settings, studentNickname) {

    function SelectRoomWindow() {
        var that = this;
        this.windowId = "selectRoomWindow";
        this.selectRoomListId = "selectRoomList";
        this.roomPwdInput = "roomPwdInput";
        this.nicknameInput = "nicknameInput";
        this.joinButtonId = "joinButton";

        this.labelTextConnecting = "connecting";
        this.labelTextWaitingNickname = "waiting for nickname confirmation";
        this.labelTextConnected = "connected";
        this.labelTextRoomInexistent = "Room does not exist";

        that.winDow = webix.ui({
            view: "window",
            id: that.windowId,
            move: true,
            modal: true,

            width: 400,
            autoheight: true,

            position: "center",

            //zIndex: 9999,

            head: "Select A Room",
            /**
             * Body
             */
            body: {
                rows: [
                    {
                        view: "list",
                        id: this.selectRoomListId,
                        template:"#roomName#",
                        select: true,
                        autoheight: true,
                        minHeight: 100,

                        on: {
                            onSelectChange:function () {
                                var item = $$(that.selectRoomListId).getSelectedItem();
                                that.__joinButtonEnable(!!item);
                                that.__roomPwdEnable(item.hasRoomPwd);
                                $$(that.nicknameInput).focus();
                            }
                        }
                    },
                    {
                        view: "text",
                        id: that.nicknameInput,
                        label: "Nickname",
                        labelWidth: 150
                    },
                    {
                        view: "text",
                        id: that.roomPwdInput,
                        label: "Room Password",
                        labelWidth: 150
                    },
                    {
                        margin: 5, cols: [
                        {
                            view: "button", id: that.joinButtonId, value: "Join", hotkey: "enter", click: function () {
                            that.joinSelectedRoom();
                        }
                        },
                        {
                            view: "button", id: "refreshRoomsButton", value: "Refresh", click: function () {
                            that.refreshButtonLogic();
                        }
                        }
                    ]
                    },
                    {
                        view:"label",
                        label: "",
                        id: "label",
                        inputWidth:100
                    }
                ]
            }  // body
        });
    } // EOF class

    SelectRoomWindow.prototype = {
        constructor: SelectRoomWindow,

        /**
         *
         * @param items Array<{{roomName: String, hasRoomPwd: boolean}}>
         * @private
         */
        __setDataByArray: function (items) {
            $$(this.selectRoomListId).clearAll();
            $$(this.selectRoomListId).parse(items);
        },

        joinSelectedRoom: function () {
            var that = this;

            that.__joinButtonEnable(false);
            this.__resetBackgroundColor();

            var selectedItem = $$(this.selectRoomListId).getSelectedItem();
            if (!selectedItem) {
                return;
            }
            var roomName = selectedItem.roomName;
            var roomPwd = $$(that.roomPwdInput).getValue();
            var nickname = $$(that.nicknameInput).getValue().trim();

            if (!studentNickname.hasMinLength(nickname) || !studentNickname.isValidNickname(nickname)) {
                this.__turnNicknameInputRed();
                this.__joinButtonEnable(true);
                return;
            } 

            this.setLabelText(this.labelTextConnecting);
            this.__connectToRoom(roomName, roomPwd, nickname);
        },

        __connectToRoom: function (roomName, roomPwd, nickname) {
            require(['webRTCStudents'], function (webRTCStudents) {
                webRTCStudents.connectToRoom(roomName, roomPwd, nickname);
            });
        },

        /**
         * @param lastConnection {{nickname: String, roomName: String, roomPwd: String}}
         */
        reconnect: function(lastConnection) {
            this.__connectToRoom(lastConnection.roomName, lastConnection.roomPwd, lastConnection.nickname);
        },

        /**
         * @param result {Boolean || String}
         */
        handleConnectResponse: function (result) {
            this.show();
            switch (result) {
                case true:
                    this.hide();
                    break;
                case settings.getErrWrongRoomPassword():
                    this.__turnRoomPwdInputRed();
                    break;
                case settings.getErrNoLecturerInRoom():
                    this.__shakeWindowOnError();
                    this.refreshButtonLogic();
                    this.setLabelText(this.labelTextRoomInexistent);
                    break;
                case settings.getErrNicknameInUse():
                    this.__turnNicknameInputRed();
                    break;
                default:
                    console.error("selectRoomWindow.js: handleConnectResponse() encountered an unexpected switch case:\n" + result);
            }
        },

        __turnRoomPwdInputRed: function () {
            this.__shakeWindowOnError();
            $("div[view_id='" + this.roomPwdInput + "'] input").css("background-color", "red");
        },

        __turnNicknameInputRed: function () {
            this.__shakeWindowOnError();
            $("div[view_id='" + this.nicknameInput + "'] input").css("background-color", "red");
        },

        __resetBackgroundColor: function() {
            var $roomInputPwd = $("div[view_id='" + this.roomPwdInput + "'] input");
            var $nicknameInput = $("div[view_id='" + this.nicknameInput + "'] input");
            $roomInputPwd.css('background-color', '');
            $nicknameInput.css('background-color', '');
        },

        refreshButtonLogic: function () {
            var that = this;
            this.__joinButtonEnable(false);
            this.__roomPwdEnable(true);
            require(['webRTCStudents'], function (webrtc) {
                webrtc.fetchAvailableRooms(function (rooms) {
                    that.__setDataByArray(rooms);
                    that.__selectFirstEntry();
                });
            });
        },

        hide: function () {
            $$(this.windowId).hide();
        },

        __clearForm: function () {
            var $roomInputPwd = $("div[view_id='" + this.roomPwdInput + "'] input");
            var $nicknameInput = $("div[view_id='" + this.nicknameInput + "'] input");

            $roomInputPwd.val("");
            $nicknameInput.val("");
            this.__setLabel("");
        },

        show: function () {
            $$(this.windowId).show();
            this.refreshButtonLogic();
            this.__clearForm();
        },

        __selectFirstEntry: function () {
            var firstId = $$(this.selectRoomListId).getFirstId();
            if (firstId) {
                $$(this.selectRoomListId).select(firstId);
            }
        },

        __shakeWindowOnError: function () {
            var len = 20;
            for (var i = 0; i < 10; i++)
                $("div[view_id='" + this.windowId + "']").animate({
                    'margin-left': "+=" + ( len = -len ) + 'px',
                    'margin-right': "-=" + len + 'px'
                }, 50);
        },

        setLabelText: function(text) {
            switch(text) {
                case this.labelTextConnecting:
                case this.labelTextWaitingNickname:
                case this.labelTextConnected:
                case this.labelTextRoomInexistent:
                    this.__setLabel(text);
                    break;
                default:
                    console.error("selectRoomWindow setLabelText() encountered an unknown parameter:\n" + text);
            }
        },

        __setLabel: function(text) {
            $$("label").setValue(text);
        },

        __joinButtonEnable: function(bool) {
            if (bool) {
                $$(this.joinButtonId).enable();
            } else {
                $$(this.joinButtonId).disable();
            }
        },

        __roomPwdEnable: function(bool) {
            if (bool) {
                $$(this.roomPwdInput).enable();
            } else {
                $$(this.roomPwdInput).disable();
            }
        }
    };

    return new SelectRoomWindow();
}); // requireJS define


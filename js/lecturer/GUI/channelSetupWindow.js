/**
 * Created by Pascal on 04.03.2016.
 */

define(['jquery', 'webix'], function ($, webix) {

    function ChannelSetupWindow() {
        var that = this;
        this.defer = $.Deferred();
        this.windowId = "channelSetupWindow";

        this.__formNames = { // TODO: validation rules are still literals
            idForm: "createRoomForm",
            inputRoomName: "roomName",
            inputAdminPwd: "adminPwdInput",
            inputRoomPwd: "roomPwdInput"
        };

        that.winDow = webix.ui({
            view: "window",
            id: that.windowId,
            move: true,
            modal: true,

            width: 400,
            autoheight: true,

            position: "center",

            zIndex: 9999,

            head: "Create Room",
            /**
             * Body
             */
            body: {
                rows: [
                    {
                        view: "form",
                        id: this.__formNames.idForm,
                        width: 300,
                        rules: {
                            "roomName": webix.rules.isNotEmpty,
                            "adminPwdInput": webix.rules.isNotEmpty
                        },
                        elementsConfig: {
                            labelPosition: "top",
                            labelWidth: 140,
                            bottomPadding: 20,
                            attributes: {
                                maxlength: 15
                            }
                        },
                        elements: [
                            {
                                view: "text",
                                id: this.__formNames.inputRoomName,
                                name: this.__formNames.inputRoomName,
                                label: "Room Name",
                                required: true,
                                invalidMessage: "Room name can not be empty"
                            },
                            {
                                view: "text",
                                id: this.__formNames.inputAdminPwd,
                                name: this.__formNames.inputAdminPwd,
                                type: "password",
                                label: "Admin Password",
                                required: true,
                                invalidMessage: "Admin password can not be empty"
                            },
                            {
                                view: "text",
                                id: this.__formNames.inputRoomPwd,
                                name: this.__formNames.inputRoomPwd,
                                label: "Room Password"
                            },
                            {
                                margin: 5, cols: [
                                {
                                    view: "button", value: "Create", type: "form", hotkey: "enter", click: function () {
                                    that.submitButtonHandler();
                                }
                                },
                                {
                                    view: "button", value: "Cancel", hotkey: "esc", click: function () {
                                    that.closeWindow();
                                }
                                }
                            ]
                            }
                        ]
                    }
                ]
            }  // body
        });

    } // EOF class

    ChannelSetupWindow.prototype = {
        constructor: ChannelSetupWindow,

        showAsync: function() {
            this.winDow.show();
            $$(this.__formNames.inputRoomName).focus();
            return this.defer.promise();
        },

        submitButtonHandler: function () {
            if ($$(this.__formNames.idForm).validate()) {

                var inputValues = $$(this.__formNames.idForm).getValues();
                var roomName = inputValues[this.__formNames.inputRoomName].trim();
                var adminPwd = inputValues[this.__formNames.inputAdminPwd].trim();
                var roomPwd = inputValues[this.__formNames.inputRoomPwd];
                if (roomPwd) {
                    roomPwd = roomPwd.trim();
                }

                this.defer.resolve(roomName, adminPwd, roomPwd);
                this.closeWindow();
            }
        },

        closeWindow: function () {
            $$(this.windowId).close();
        }
    };


    return ChannelSetupWindow;
}); // requireJS define
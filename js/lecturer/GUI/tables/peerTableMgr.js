/**
 * Created by Pascal on 08.06.2014.
 * This table shows the currently connected peers.
 * Peers can be selected/deselected.
 * Peers can be kicked
 */

define(['jquery', 'popupWindow', 'connectedPeers', 'webix'], function ($, popupWindow, connectedPeers, webix) {

    function PeerTableMgr() {

        var that = this;
        that.windowID = "peerTableWindow";
        that.tableID = "peerTable";

        this.table = webix.ui({
            view: "popup",
            position: "center",
            id: that.windowID,
            width: 500,
            height: 400,
            body: {
                view: "datatable",
                id: that.tableID,
                tooltip: true,
                scrollX: false,
                autowidth: true,

                columns: [
                    {
                        id: "index",
                        header: "ID",
                        tooltip: false,
                        adjust:"data"
                    },
                    {
                        id: "id",
                        header: "Peer"
                    },

                    {
                        id: "nickname",
                        header: "Nickname"
                    },

                    {
                        id: "state",
                        header: "State",
                        fillspace: true
                    },

                    {
                        id: "kick",
                        header: "Kick",
                        tooltip: false,
                        template: "<button type='button' class='btn btn-default btn-sm delete_button myTableButtons'><span class='glyphicon glyphicon-remove' style='color: indianred'></span></button>"
                    }
                ],

                onClick: {
                    "delete_button": function (e, id) {
                        that.kick(id);
                        return false;
                    }
                },

                on: {
                    "data->onStoreUpdated": function () {
                        this.data.each(function (obj, i) {
                            obj.index = i + 1;
                        });
                    },

                    /**
                     * Workaround to be able to refactor this to a non webix.ui() calling function.
                     * No functions, that call this.table might be run before the constructor
                     */
                    onAfterRender: function () {
                        if (!this.count()) {
                            this.showOverlay("<span class='webix_loading_overlay'>This table will show all connected peers</span>");
                        }
                        else {
                            this.hideOverlay();
                        }
                    }
                }
            } // window body
        });

    } // EOF class


    PeerTableMgr.prototype = {
        constructor: PeerTableMgr,

        add: function (userid) {
            if (!this.isDuplicate(userid)) {
                var data = {
                    id: userid
                };

                $$(this.tableID).add(data);
                $$(this.tableID).refresh();
            } // isDuplicate
        },

        addNicknameToUserid: function(userid, nickname){
            var item = $$(this.tableID).getItem(userid);
            item.nickname = nickname;
            $$(this.tableID).updateItem(userid, item);
        },

        setConnectionStateForPeerId: function(peerId, state) {
            var item = $$(this.tableID).getItem(peerId);
            if (!item) {
                return;
            }
            item.state = state;
        },

        kick: function (id) {
            var that = this;
            var selectedItem = $$(this.tableID).getItem(id);
            var peerId = selectedItem.id;
            require(['webRTCLecturer'], function (webRTCLecturer) {
                webRTCLecturer.kick(peerId);
                that.removePeer(id);
            });
        },

        isDuplicate: function (id) {
            var that = this;

            if (id && $$(that.tableID).exists(id)) {

                popupWindow(2000, "Error while loading to table", "You tried to load the same item twice. ItemID: " + id + " already exists!");
                return true;
            }
            return false;
        },

        removePeer: function (peerid) {
            if ($$(this.tableID).data.exists(peerid)) {
                $$(this.tableID).remove(peerid);
            }
        },

        showPeerTable: function(){
            $$(this.windowID).show();
        }
    };

    return new PeerTableMgr();
});   // define requireJs
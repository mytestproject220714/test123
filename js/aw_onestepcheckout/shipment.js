AWOnestepcheckoutShipment = Class.create();
AWOnestepcheckoutShipment.prototype = {
    initialize: function(config) {
        window.shippingMethod = {};
        window.shippingMethod.validator = null;
        this.container = $$(config.containerSelector).first();
        this.switchMethodInputs = $$(config.switchMethodInputsSelector);
        this.saveShipmentUrl = config.saveShipmentUrl;

        this.init();
        this.initObservers();
    },

    init: function() {
        var me = this;
        this.switchMethodInputs.each(function(element) {
            var methodCode = element.value;
            if (element.checked) {
                me.currentMethod = methodCode;
            }
        });
    },

    initObservers: function() {
        var me = this;
        this.switchMethodInputs.each(function(element) {
            element.observe('click', function(e) {
                me.switchToMethod(element.value);
            });
        })
    },

    switchToMethod: function(methodCode) {
        if (this.currentMethod !== methodCode) {
            AWOnestepcheckoutCore.updater.startRequest(this.saveShipmentUrl, {
                method: 'post',
                parameters: Form.serialize(this.container, true)
            });
            this.currentMethod = methodCode;
        }
    }
};

/* Giftwrap from Enterprise */
AWOnestepcheckoutShipmentEnterpriseGiftwrap = Class.create();
AWOnestepcheckoutShipmentEnterpriseGiftwrap.prototype = {
    initialize: function(config) {
        // init dom elements
        this.addPrintedCardCheckbox = $(config.addPrintedCardCheckbox);
        this.addGiftOptionsCheckbox = $(config.addGiftOptionsCheckbox);

        // init urls
        this.addPrintedCardUrl = config.addPrintedCardUrl;

        // init behaviour
        this.init();
    },
    init: function() {
        if (this.addPrintedCardCheckbox) {
            this.addPrintedCardCheckbox.observe('change', this.addPrintedCard.bind(this))
        }
        if (this.addGiftOptionsCheckbox) {
            this.addGiftOptionsCheckbox.observe('change', this.addGiftOptions.bind(this))
        }
    },
    addPrintedCard: function() {
        var me = this;
        var requestOptions = {
            method: 'post',
            parameters: {add_printed_card: this.addPrintedCardCheckbox.getValue()},
            onComplete: function(transport) {
                me._onAjaxCompleteFn(transport);
            }
        };
        AWOnestepcheckoutCore.updater.startRequest(this.addPrintedCardUrl, requestOptions);
    },
    addGiftOptions: function() {
        if (this.addPrintedCardCheckbox.getValue() || this.isPrintedCardApplied) {
            var requestOptions = {
                method: 'post',
                parameters: {add_printed_card: 0},
                onComplete: function(transport) {
                    me._onAjaxCompleteFn(transport);
                }
            };
            AWOnestepcheckoutCore.updater.startRequest(this.addPrintedCardUrl, requestOptions);
        }
    },
    _onAjaxCompleteFn: function(transport) {
        try {
            eval("var json = " + transport.responseText + " || {}");
        } catch(e) {
            this.showError(this.jsErrorMsg);
            return;
        }
        this.isPrintedCardApplied = json.printed_card_applied;
    }
};
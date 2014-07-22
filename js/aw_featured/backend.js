var AWAFPBlockEditForm = Class.create({
    initialize: function(objName, ajaxUrl) {
        this.updateAjaxUrl(ajaxUrl);

        this.typeChanger = 'type';
        this.autoChanger = 'automation_type';
        this.optionsFieldset = 'awf_types_settings';
        this.optionsFieldsetInner = 'types_data_fset';
        this.global = window;
        this._selfObjectName = objName;
        this.global[this._selfObjectName] = this;

        this.gridProducts = 'gridcontainer_products';
        this.gridCategories = 'gridcontainer_categories';
        this.categoriesQuota = 'quantity_limit';
        this.productSortingType = 'product_sorting_type';
        this.categoryAutomation = 'current_category_type';

        this.selectedProducts = [];
        this.selectedProductsStorage = 'automation_data_products';
        this.selectedCategories = [];
        this.selectedCategoriesStorage = 'automation_data_categories';

        this.messages = {
            changeImage: 'Change Image'
        };

        this.selectors = {
            imageSelectorGrid: 'awfeatured_primselector'
        };

        this.typesCache = [];
        Event.observe(document, 'dom:loaded', this.initAction.bind(this));
    },

    translateMessages: function() {
        if(typeof Translator != 'undefined' && Translator) {
            for(var line in this.messages) {
                this.messages[line] = Translator.translate(this.messages[line]);
            }
        }
    },

    _url: function(url) {
        var _url = typeof(url) != 'undefined' ? url : '';
        return _url.replace(/^http[s]{0,1}/, window.location.href.replace(/:[^:].*$/i, ''));
    },

    updateAjaxUrl: function(ajaxUrl) {
        this.ajaxUrl = this._url(ajaxUrl);
    },

    updateISUrl: function(url) {
        this.ISUrl = this._url(url);
    },

    updateSetImageUrl: function(url) {
        this.setImageUrl = this._url(url);
    },

    _sortNumberFunction: function(a, b) {
        return a - b;
    },

    loadProducts: function(products) {
        if(typeof(products) == 'undefined') {
            if($(this.selectedProductsStorage))
                this.selectedProducts = $(this.selectedProductsStorage).value.split(',');
        } else {
            this.selectedProducts = products.split(',');
        }
        this.selectedProducts.sort(this._sortNumberFunction);
        $$('#'+this.gridProducts+' input.checkbox').each(function(checkbox) {
            if(!(this._findElement(this.selectedProducts, parseInt(checkbox.value))===false)) {
                checkbox.checked = true;
            }
        }, this);
    },

    _showLoading: function() {
        $('loading-mask').show();
    },

    _hideLoading: function() {
        $('loading-mask').hide();
    },

    _showError: function() {
        awafpbo._hideLoading();
        $(this.optionsFieldsetInner).innerHTML = '<p class="awafp-error">Some error occurs, please, try again to select representation type</p>';
    },

    checkTypes: function(_init) {
        if(typeof this.typesCache[$(this.typeChanger).value] != 'undefined') {
            $(this.optionsFieldset).replace(this.typesCache[$(this.typeChanger).value]);
            return;
        }
        this._showLoading();
        awafpbo = this;
        this._checkTypesInit = (_init === true) ? 1 : 0;
        new Ajax.Request(this.ajaxUrl, {
            method: 'get',
            parameters: {
                type: $(awafpbo.typeChanger).value,
                isInit: awafpbo._checkTypesInit
            },
            onSuccess: function(transport) {
                awafpbo._hideLoading();
                var resp = transport.responseText.evalJSON(true);
                if(typeof resp == 'object') {
                    $(awafpbo.optionsFieldset).replace(resp.text);
                    awafpbo.typesCache[$(awafpbo.typeChanger).value] = resp.text;
                } else {
                    awafpbo._showError();
                }
            },
            onFailure: function() {
                awafpbo._showError();
            },
            onException: function() {
                awafpbo._showError();
            }
        });
    },

    checkAutomation: function() {
        if($(this.autoChanger).value == 0) {
            $(this.productSortingType).up().up().show();
            $(this.gridProducts).up().up().show();
            $(this.gridCategories).up().up().hide();
            $(this.categoriesQuota).up().up().hide();
            $(this.categoryAutomation).up().up().hide();
        } else if ($(this.autoChanger).value == 6) {
              $(this.productSortingType).up().up().hide();
            $(this.gridProducts).up().up().hide();
            $(this.gridCategories).up().up().hide();
            $(this.categoriesQuota).up().up().show();
            $(this.categoryAutomation).up().up().show();
        } else {
            $(this.productSortingType).up().up().hide();
            $(this.gridProducts).up().up().hide();
            $(this.categoryAutomation).up().up().hide();
            $(this.gridCategories).up().up().show();
            $(this.categoriesQuota).up().up().show();
        }
    },

    initAction: function() {
        new PeriodicalExecuter(function(pe) {
            if(typeof( awfeatured_productsselectorJsObject) != 'undefined') {
                awfeatured_productsselectorJsObject.filterKeyPress= function (event){
                    console.log(awfeatured_productsselectorJsObject);
                    if(event.keyCode==Event.KEY_RETURN){
                        awfBForm.awf_filter();
                    }
                };
                awfeatured_productsselectorJsObject.bindFilterFields();
                pe.stop();
            }
        }, 1);
        if(this.typeChanger && this._getSelfObjectName() && $(this.typeChanger))
            $(this.typeChanger).observe('change', this.global[this._getSelfObjectName()].checkTypes.bind(this));
        if(this.autoChanger && this._getSelfObjectName() && $(this.autoChanger))
            $(this.autoChanger).observe('change', this.global[this._getSelfObjectName()].checkAutomation.bind(this));
        this.checkTypes(true);
        this.checkAutomation();
        this.loadProducts();
        this.translateMessages();
    },

    _getSelfObjectName: function() {
        return this._selfObjectName;
    },

    _removeSelected: function(arr, value) {
        /* binary search */
        if(typeof arr.length == 'undefined') return false;
        var up = arr.length-1;
        var down = 0;
        value = parseInt(value);
        do {
            var center = (up+down)/2;
            center = center.round();
            if(value == parseInt(arr[center])) {
                this.selectedProducts = this.selectedProducts.slice(0, center).concat(this.selectedProducts.slice(center+1));
                return true;
            }
            if(value < parseInt(arr[center]))
                up = center-1;
            else
                down = center+1;
        } while(up>=down);
        return false;
    },

    _findElement: function(arr, value) {
        /* binary search */
        if(typeof arr.length == 'undefined') return false;
        var up = arr.length-1;
        var down = 0;
        value = parseInt(value);
        do {
            var center = (up+down)/2;
            center = center.round();
            if(value == parseInt(arr[center])) {
                return center;
            }
            if(value < parseInt(arr[center]))
                up = center-1;
            else
                down = center+1;
        } while(up>=down);
        return false;
    },

    productCheckboxClicked: function(event) {
        var element = event.element();
        if(element.checked) {
            this.selectedProducts.push(element.value);
            this.selectedProducts.sort(this._sortNumberFunction);
        } else {
            this._removeSelected(this.selectedProducts, element.value);
        }
        $(this.selectedProductsStorage).value = this.selectedProducts.toString();
    },

    productGridRowInit: function(grid, row) {
        var id = row.identify();
        var checkbox = $$('#'+id+' input.checkbox').first();
        if(typeof checkbox == 'undefined') return;
        checkbox.observe('change', this.global[this._getSelfObjectName()].productCheckboxClicked.bind(this));
        if(!(this._findElement(this.selectedProducts, checkbox.value)===false)) {
            checkbox.checked = true;
        }
    },

    prepareForm: function() {
        this._pe = new PeriodicalExecuter(this._resizeWindow.bind(this), 0.1);
    },

    _resizeWindow: function() {
        if(this.selectors.imageSelectorGrid && $(this.selectors.imageSelectorGrid) && $(this.selectors.imageSelectorGrid).getWidth() && $(this.selectors.imageSelectorGrid).getHeight()) {
            if(this._pe) {
                this._pe.stop();
                this._pe = null;
            }
            if(this.window) {
                this.window.setSize(Math.max(650, $(this.selectors.imageSelectorGrid).getWidth()), Math.min(500, $(this.selectors.imageSelectorGrid).getHeight()+30));
                this.window.showCenter();
            }
        }
    },

    changeImage: function(pid, blockId) {
        this.window = new Window({
            className: 'magento',
            width: 650,
            height: 500,
            destroyOnClose: true,
            recenterAuto:false,
            zIndex: 101
        });

        this.window.setTitle(this.messages.changeImage);
        this.window.setAjaxContent(this.ISUrl, {
            parameters: {pid: pid, blockId: blockId},
            onComplete: this.prepareForm.bind(this)
        }, true, true);
    },

    setProductImage: function(productId, blockId, imageId) {
        if($('loading-mask')) $('loading-mask').show();
        new Ajax.Request(this.setImageUrl, {
            parameters: {
                productId: productId,
                blockId: blockId,
                imageId: imageId
            },
            onComplete: this.afterSetProductImage.bind(this)
        });
    },

    afterSetProductImage: function(response) {
        if($('loading-mask')) $('loading-mask').hide();
        if(this.window) this.window.close();
        if(awfeatured_productsselectorJsObject) awfeatured_productsselectorJsObject.reload();
    },

    awf_filter: function (){
        awfeatured_productsselectorJsObject.addVarToUrl('awf_ids', $('automation_data_products').value);
        awfeatured_productsselectorJsObject.doFilter();
    }
});

new AWAFPBlockEditForm('awfBForm');

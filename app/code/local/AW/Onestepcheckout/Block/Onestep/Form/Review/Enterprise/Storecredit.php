<?php
/**
 * aheadWorks Co.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://ecommerce.aheadworks.com/AW-LICENSE.txt
 *
 * =================================================================
 *                 MAGENTO EDITION USAGE NOTICE
 * =================================================================
 * This software is designed to work with Magento community edition and
 * its use on an edition other than specified is prohibited. aheadWorks does not
 * provide extension support in case of incorrect edition use.
 * =================================================================
 *
 * @category   AW
 * @package    AW_Onestepcheckout
 * @version    1.2.5
 * @copyright  Copyright (c) 2010-2012 aheadWorks Co. (http://www.aheadworks.com)
 * @license    http://ecommerce.aheadworks.com/AW-LICENSE.txt
 */


class AW_Onestepcheckout_Block_Onestep_Form_Review_Enterprise_Storecredit extends Mage_Checkout_Block_Onepage_Abstract
{
    public function canShow()
    {
        if (Mage::helper('aw_onestepcheckout/enterprise_storecredit')->isStoreCreditEnabled()) {
            return true;
        }
        return false;
    }

    public function isStoreCreditSectionAvailable()
    {
        return Mage::helper('aw_onestepcheckout/enterprise_storecredit')->isStoreCreditSectionAvailable();
    }

    public function getBalance()
    {
        return Mage::helper('aw_onestepcheckout/enterprise_storecredit')->getBalance();
    }

    public function isCustomerBalanceUsed()
    {
        return Mage::helper('aw_onestepcheckout/enterprise_storecredit')->isCustomerBalanceUsed();
    }

    public function formatPrice($value)
    {
        return Mage::getSingleton('adminhtml/session_quote')->getStore()->formatPrice($value);
    }

    public function getApplyStorecreditAjaxUrl()
    {
        return Mage::getUrl('onestepcheckout/ajax/applyEnterpriseStorecredit', array('_secure' => true));
    }
}
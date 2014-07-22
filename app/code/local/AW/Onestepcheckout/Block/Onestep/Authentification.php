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


class AW_Onestepcheckout_Block_Onestep_Authentification extends Mage_Checkout_Block_Onepage_Abstract
{

    public function addFBIButton()
    {
        if (!$this->canFBIShow()) {
            return $this;
        }
        $fbButtonBlock = $this->getLayout()->createBlock("fbintegrator/connect", "aw_onestepcheckout.onestep.auth.fb");
        $fbButtonBlock->setTemplate("fbintegrator/fb_connect.phtml");
        $this->append($fbButtonBlock, "fb");
        return $this;
    }

    public function canShow()
    {
        if (Mage::getSingleton('customer/session')->isLoggedIn()) {
            return false;
        }
        return true;
    }

    public function canFBIShow()
    {
        if (Mage::getSingleton('customer/session')->isLoggedIn()) {
            return false;
        }
        if (!Mage::helper('core')->isModuleEnabled('AW_FBIntegrator')) {
            return false;
        }
        return true;
    }


    public function getLoginAjaxAction()
    {
        return Mage::getUrl('onestepcheckout/ajax/customerLogin', array('_secure'=>true));
    }

    public function getForgotPasswordAjaxAction()
    {
        return Mage::getUrl('onestepcheckout/ajax/customerForgotPassword', array('_secure'=>true));
    }

    public function getFbButtonRequestUrl()
    {
        return Mage::getUrl('onestepcheckout/ajax/customerLoginViaFacebookIntegrator', array('_secure'=>true));
    }

    public function getUsername()
    {
        $username = Mage::getSingleton('customer/session')->getUsername(true);
        return $this->escapeHtml($username);
    }
}
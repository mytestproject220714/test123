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


class AW_Onestepcheckout_Helper_Customer extends Mage_Core_Helper_Abstract
{
    //TODO: check on 1.5 and 1.6
    public function sendForgotPasswordForCustomer(Mage_Customer_Model_Customer $customer)
    {
        if (method_exists(Mage::helper('customer'), 'generateResetPasswordLinkToken')) {
            $newResetPasswordLinkToken = Mage::helper('customer')->generateResetPasswordLinkToken();
            $customer->changeResetPasswordLinkToken($newResetPasswordLinkToken);
            $customer->sendPasswordResetConfirmationEmail();
        } else {
            $newPassword = $customer->generatePassword();
            $customer->changePassword($newPassword, false);
            $customer->sendPasswordReminderEmail();
        }
    }
}
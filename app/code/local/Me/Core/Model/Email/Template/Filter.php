<?php
class Me_Core_Model_Email_Template_Filter extends Mage_Core_Model_Email_Template_Filter
{
    public function translateDirective($construction)
    {
        $params = $this->_getIncludeParameters($construction[2]);
        $text = $params['text'];
        return Mage::helper('page')->__($text);
    }
}

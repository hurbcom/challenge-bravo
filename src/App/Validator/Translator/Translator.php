<?php

declare(strict_types=1);

namespace App\Validator\Translator;

use Laminas\I18n\Translator\TranslatorAwareInterface;
use Laminas\I18n\Translator\TranslatorInterface;

class Translator implements TranslatorAwareInterface, \Laminas\Validator\Translator\TranslatorInterface
{
    /**
     * Translator used for translatable segments.
     */
    protected TranslatorInterface $translator;

    /**
     * Whether the translator is enabled.
     */
    protected bool $translatorEnabled = true;

    /**
     * Translator text domain to use.
     */
    protected string $translatorTextDomain = 'default';

    /**
     * @inheritDoc
     */
    public function translate($message, $textDomain = 'default', $locale = null)
    {
        return $this->translator->translate($message, $textDomain, $locale);
    }

    /**
     * @inheritDoc
     */
    public function setTranslator(?TranslatorInterface $translator = null, $textDomain = null)
    {
        $this->translator = $translator;

        if ($textDomain !== null) {
            $this->setTranslatorTextDomain($textDomain);
        }

        return $this;
    }

    /**
     * @inheritDoc
     */
    public function getTranslator()
    {
        return $this->translator;
    }

    /**
     * @inheritDoc
     */
    public function hasTranslator()
    {
        return $this->translator !== null;
    }

    /**
     * @inheritDoc
     */
    public function setTranslatorEnabled($enabled = true)
    {
        $this->translatorEnabled = $enabled;

        return $this;
    }

    /**
     * isTranslatorEnabled(): defined by TranslatorAwareInterface.
     *
     * @see    TranslatorAwareInterface::isTranslatorEnabled()
     */
    public function isTranslatorEnabled(): bool
    {
        return $this->translatorEnabled;
    }

    /**
     * @inheritDoc
     */
    public function setTranslatorTextDomain($textDomain = 'default')
    {
        $this->translatorTextDomain = $textDomain;

        return $this;
    }

    /**
     * @inheritDoc
     */
    public function getTranslatorTextDomain()
    {
        return $this->translatorTextDomain;
    }
}

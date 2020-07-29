<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Constants;
use App\Validator\Translator\Translator as ValidatorTranslator;
use Laminas\I18n\Translator\Translator as I18nTranslator;
use Laminas\Validator\AbstractValidator;
use Locale;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

use function file_exists;
use function getenv;
use function sprintf;

class SetupTranslatorMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $locale = getenv('LOCALE') ?: Constants::LOCALE_DEFAULT;
        if (
            file_exists(
                sprintf(
                    './vendor/laminas/laminas-i18n-resources/languages/%s/Laminas_Validate.php',
                    $locale
                )
            )
        ) {
            $translator = new I18nTranslator();
            $translator->setLocale($locale);
            $translator->addTranslationFile(
                'phparray',
                sprintf('vendor/laminas/laminas-i18n-resources/languages/%s/Laminas_Validate.php', $locale),
                'default',
                $locale
            );
            Locale::setDefault($locale);
            $translatorDefault = new ValidatorTranslator();
            $translatorDefault->setTranslator($translator);
            AbstractValidator::setDefaultTranslator($translatorDefault);
            $request->withAttribute('translator', $translator);
        }

        return $handler->handle($request);
    }
}

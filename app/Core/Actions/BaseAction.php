<?php

namespace App\Core\Actions;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

abstract class BaseAction
{
    /**
     * @var array
     */
    protected $data;

    /**
     * @var \Illuminate\Contracts\Validation\Validator
     */
    private $validator;

    /**
     * @return array
     */
    abstract public function rules(): array;

    /**
     * @return array
     */
    abstract public function messages(): array;

    /**
     * @return mixed
     */
    abstract public function execute();

    /**
     * @return bool
     */
    protected function passes(): bool
    {
        return $this->validator->passes();
    }

    /**
     * @param array $data
     */
    protected function prepare(array $data): void
    {
        $this->data = $data;

        $this->validator = Validator::make($data, $this->rules(), $this->messages());
    }

    /**
     * @param array $data
     * @return mixed
     * @throws ValidationException
     */
    public function run(array $data)
    {
        $this->prepare($data);

        if ($this->passes()) {
            return $this->execute();
        }

        throw new ValidationException($this->validator);
    }

    /**
     * @param string $key
     * @param null $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        return Arr::get($this->data, $key, $default);
    }
}
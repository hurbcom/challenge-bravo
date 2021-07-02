<?php

use PHPUnit\Framework\TestCase;
use Src\Validator;

class ValidatorTest extends TestCase
{
    /**
     * @dataProvider additionProvider
     */
    public function testValidators($params, $rules, $expected)
    {
        $validator = Validator::make($params, $rules);
        $errors = json_encode($validator->getErrors());
        $this->assertEquals($expected, $errors);
    }

    public function additionProvider()
    {
        return [
            [[], ['field' => 'required'], '{"field":["field is required"]}'], /* field without value is required */
            [['field' => 'foo'], ['field' => 'required'], '[]'], /* field is required and has value */
            [['field' => 'foo'], ['field' => 'is_upercase'], '{"field":["field must be a uppercase"]}'], /* field non-upercase must be upercase */
            [['field' => 'FOO'], ['field' => 'is_upercase'], '[]'], /* field in upercase must be upercase */
            [['field' => 'foo'], ['field' => 'numeric'], '{"field":["field must be contain a numeric value"]}'], /* field non numeric must be a numeroc */
            [['field' => 1], ['field' => 'numeric'], '[]'], /* field numeric must be numeric */
            [['field' => 'foo'], ['field' => 'required_if:field2=bat'], '[]'], /* field required_if field2=bat but field2 not exist */
            [['field' => 'foo'], ['field2' => 'required_if:field<>foo'], '[]'], /* field2 required_if field <> foo but field = foo  */
            [['field' => 'fo'], ['field2' => 'required_if:field=foo'], '[]'],
            [['field' => 'foo'], ['field2' => 'required_if:field=foo'], '{"field2":["field2 is required if field = foo"]}'],
            [['field' => 'foo'], ['field2' => 'required_if:field<>fo'], '{"field2":["field2 is required if field <> fo"]}'],
        ];
    }

    public function testUniqueValidatorReturnErrorIfFieldExists()
    {
        $mock = $this->getMockBuilder(\App\Models\Currency::class)
            ->disableOriginalConstructor()
            ->setMethods(['exists'])
            ->getMock();
        $mock->expects($this->once())
            ->method('exists')
            ->will($this->returnValue(true));
        $validator = Validator::attach($mock);

        $validatorReturn = Validator::make(['field' => 'foo'], ['field' => 'unique:currency']);
        $this->assertEquals('{"field":["field must be a unique"]}', json_encode($validatorReturn->getErrors()));
    }

    public function testUniqueValidatorPassIfFieldNotExists()
    {
        $mock = $this->getMockBuilder(\App\Models\Currency::class)
            ->disableOriginalConstructor()
            ->setMethods(['exists'])
            ->getMock();
        $mock->expects($this->once())
            ->method('exists')
            ->will($this->returnValue(false));
        $validator = Validator::attach($mock);

        $validatorReturn = Validator::make(['field' => 'foo'], ['field' => 'unique:currency']);
        $this->assertEquals('[]', json_encode($validatorReturn->getErrors()));
    }
}
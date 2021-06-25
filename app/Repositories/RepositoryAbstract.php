<?php

namespace App\Repositories;

use Exception;
use Illuminate\Support\Facades\App;

abstract class RepositoryAbstract implements RepositoryInterface
{
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $model;

    public function __construct($repositoryName)
    {
        $modelName = str_replace('Repository', '', last(explode('\\', $repositoryName)));
        $this->model = $this->factory($modelName);
    }

    private function factory($modelName)
    {
        $factoryFind = [
            base_path('app'.DIRECTORY_SEPARATOR .'Models'.DIRECTORY_SEPARATOR ) => 'App\Models\\',
        ];
        $instance = null;
        foreach ( $factoryFind as $path => $namespace ) {
            if ( file_exists($path . $modelName . '.php' ) ) {
                $instance = App::make($namespace . $modelName);
            }
        }

        if( empty( $instance ) ){ 
            throw new Exception( 'Instancia Model ' . $modelName . ' não encontrada' ); 
        }

        return $instance;
    }

    public function getModel()
    {
        return $this->model;
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function findBy(string $key, string $value)
    {
        return $this->model->where($key, $value)->first();
    }

    public function all()
    {
        return $this->model->all();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(array $data, $id)
    {
        return $this->model->find($id)->update($data);
    }

    public function firstOrCreate(array $data)
    {
        return $this->model->firstOrCreate($data);
    }

    public function deleteBy(string $key, $value)
    {
        return $this->model->where($key, $value)->delete();
    }

    public function destroy($id)
    {
        return $this->model->destroy($id);
    }

    public function paginate($pages)
    {
        return $this->model->paginate($pages);
    }
}
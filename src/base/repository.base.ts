import { DataSource, EntityTarget, FindOptionsWhere, Repository } from 'typeorm';

import { EntityBase } from './entity.base';

export abstract class RepositoryBase<T extends EntityBase> extends Repository<T> {
    protected constructor(entity: EntityTarget<T>, dataSource: DataSource) {
        super(entity, dataSource.createEntityManager());
    }

    async softDeleteById(id: string): Promise<T> {
        const data = await this.findOneBy({ id } as FindOptionsWhere<T>);
        data.isActive = false;
        return await this.save(data);
    }
}

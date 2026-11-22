import { Routes } from '@angular/router';

import { Home } from './pages/home/home'
import { Users } from './pages/users/users';
import { UserCreate } from './pages/user-create/user-create';
import { UserUpdate } from './pages/user-update/user-update';
import { User } from './pages/user/user';
import { Products } from './pages/products/products';
import { Product } from './pages/product/product';
import { ProductCreate } from './pages/product-create/product-create';
import { ProductUpdate } from './pages/product-update/product-update';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'users',
        component: Users
    },
    {
        path: 'users/new',
        component: UserCreate 
    },
    {
        path: 'users/:id',
        component: User
    },
    {
        path: 'users/:id/edit',
        component: UserUpdate
    },
    {
        path: 'products',
        component: Products
    },
        {
        path: 'products/new',
        component: ProductCreate
    },
    {
        path: 'products/:id',
        component: Product
    },
    {
        path: 'products/:id/edit',
        component: ProductUpdate
    }
];

import { Routes } from '@angular/router';

import { Users } from './pages/users/users';
import { User } from './pages/user/user';
import { Product } from './pages/product/product';

export const routes: Routes = [
    {
        path: 'users',
        component: Users
    },
    {
        path: 'users/:id',
        component: User
    },
    {
        path: 'products',
        component: Product
    },
];

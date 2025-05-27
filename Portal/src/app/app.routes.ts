import { Routes } from '@angular/router';
import { gaurdGuard } from './gaurd/gaurd.guard';
import { vengaurdGuard } from './gaurd/vengaurd.guard';
import { empgaurdGuard } from './gaurd/empgaurd.guard';


export const routes: Routes = [
    {
        path:"",
        redirectTo:"frontpage",
        pathMatch:"full"

    },
    {
     path:'frontpage',
     loadComponent: () => import('./front-page/front-page.component').then(m => m.FrontPageComponent)
    },
    { 
    path: 'login', 
    loadComponent: () => import('./Login/login/login.component').then(m => m.LoginComponent) 
  },
  {
        path: 'login2',
        loadComponent:() => import('./Login2/login2/login2.component').then(m=>m.Login2Component)
  },
  { 
    path: 'login3', 
    loadComponent: () => import('./Login3/login3/login3.component').then(m => m.Login3Component) 
  },
  { 
    path:"layout", 
    loadComponent: () => import('./Layout/layout/layout.component').then(m => m.LayoutComponent),
    canActivate:[gaurdGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'profile', 
        pathMatch: 'full' 
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./Layout/profile/profile.component').then(m => m.ProfileComponent) ,
        
      },
      { 
        path: 'customer-dashboard', 
        loadComponent: () => import('./Layout/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
      },
       {
        path: 'customer-dashboard/inquiries',
        loadComponent: () => import('./Layout/customer-dashboard/inquiries/inquiries.component').then(m => m.InquiriesComponent)
      },
      { 
        path: 'customer-dashboard/sales-data',
        loadComponent: () => import('./Layout/customer-dashboard/sales-data/sales-data.component').then(m => m.SalesDataComponent)   
      },
      { 
        path: 'customer-dashboard/delivery',
        loadComponent: () => import('./Layout/customer-dashboard/delivery/delivery.component').then(m => m.DeliveryComponent)
      },
      { 
        path: 'customer-financial', 
        loadComponent: () => import('./Layout/customer-financial/customer-financial.component').then(m => m.CustomerFinancialComponent) 
      },
     { 
        path: 'customer-financial/invoice', 
        loadComponent: () => import('./Layout/customer-financial/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent) 
      },
      { 
        path: 'customer-financial/credit-debit', 
        loadComponent: () => import('./Layout/customer-financial/credit-debit-memo/credit-debit-memo.component').then(m => m.CreditDebitMemoComponent) 
      },
      { 
        path: 'customer-financial/overall-salesdata', 
        loadComponent: () => import('./Layout/customer-financial/overall-salesdata/overall-salesdata.component').then(m => m.OverallSalesdataComponent) 
      },
      { 
        path: 'customer-financial/payment', 
        loadComponent: () => import('./Layout/customer-financial/payment-aging/payment-aging.component').then(m =>m.PaymentAgingComponent) 
      }
    ]
  },
  {
    path:'layout2',
    loadComponent:() => import('./Layout2/layout/layout.component').then(m=>m.LayoutComponent),
    canActivate:[vengaurdGuard],
    children: [
      {
        path:'',
        redirectTo:'profile',
        pathMatch:'full'
      },
      {
        path:'profile',
        loadComponent:() => import('./Layout2/profile/profile.component').then(m=>m.ProfileComponent)
      },
      {
        path:'cust-dash',
        loadComponent:() => import('./Layout2/customer-dashboard/customer-dashboard.component').then(m=>m.CustomerDashboardComponent)
      },
      {
        path:'cust-finance',
        loadComponent:() => import('./Layout2/customer-finance/customer-finance.component').then(m=>m.CustomerFinanceComponent)
      },
      {
        path:'cust-dash/req-qot',
        loadComponent:() => import('./Layout2/customer-dashboard/request-quotation/request-quotation.component').then(m=>m.RequestQuotationComponent)
      },
      {
        path:'cust-dash/pur-goods',
        loadComponent:() => import('./Layout2/customer-dashboard/purchase-goods/purchase-goods.component').then(m=>m.PurchaseGoodsComponent)
      },
      {
        path:'cust-dash/goods-recipt',
        loadComponent:() => import('./Layout2/customer-dashboard/goods-recipt/goods-recipt.component').then(m=>m.GoodsReciptComponent)
      },
      {
        path:'cust-finance/invoice',
        loadComponent:() => import('./Layout2/customer-finance/invoice/invoice.component').then(m => m.InvoiceComponent)
      },
      {
        path:'cust-finance/payment-aging',
        loadComponent:() => import('./Layout2/customer-finance/payment-aging/payment-aging.component').then(m=>m.PaymentAgingComponent)
      },
      {
        path:'cust-finance/credit-debit-memo',
        loadComponent: () => import('./Layout2/customer-finance/credit-debit-memo/credit-debit-memo.component').then(m=>m.CreditDebitMemoComponent)
      }
    ]
  },
  {
    path:'layout3',
    loadComponent:() => import('./Layout3/layout/layout.component').then(m=>m.LayoutComponent),
    canActivate:[empgaurdGuard],
    children:[
      {
        path:'',
        redirectTo:'emp-profile',
        pathMatch:'full'
      },
      {
        path:'emp-profile',
        loadComponent: () => import('./Layout3/employee-profile/employee-profile.component').then(m => m.EmployeeProfileComponent)
      },
      {
        path:'pay-slip',
        loadComponent: () => import('./Layout3/pay-slip/pay-slip.component').then(m => m.PaySlipComponent)
      },
      {
        path:'leave-req',
        loadComponent:() => import('./Layout3/leave-request/leave-request.component').then(m => m.LeaveRequestComponent)
      }
    ]
  }
];
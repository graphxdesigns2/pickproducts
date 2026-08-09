'use client';

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomer } from '@/context/CustomerContext';

const NAV_STRUCTURE = [
  {
    label: 'Account Overview',
    href: '/account',
    subItems: [
      { label: 'Personal Information', href: '/account#personal-info' },
      { label: 'Phone Number', href: '/account#phone' },
      { label: 'Email Address', href: '/account#email' },
      { label: 'Shipping Address', href: '/account#shipping-address' },
    ],
  },
  {
    label: 'My Orders',
    href: '/account/orders',
    subItems: [
      { label: 'Current Orders', href: '/account/orders#current-orders' },
      { label: 'Order History', href: '/account/orders#order-history' },
    ],
  },
  {
    label: 'Account Settings',
    href: '/account/settings',
    subItems: [
      { label: 'Change Password', href: '/account/settings#change-password' },
      { label: 'Email Preferences', href: '/account/settings#email-preferences' },
      { label: 'Delete Account', href: '/account/settings#delete-account' },
    ],
  },
];

export default function AccountLayout({ children }) {
  const { customer, loading, logout } = useCustomer();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login');
    }
  }, [loading, customer, router]);

  async function handleLogout(e) {
    e.preventDefault();
    await logout();
    router.push('/');
  }

  if (loading || !customer) {
    return (
      <>
        <Header />
        <div className="account-container">
          <p style={{ padding: '40px', color: '#9aa3b5' }}>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="account-container">
        <aside className="account-sidebar">
          <div className="user-badge">
            <div className="user-info">
              <span className="user-name">
                {[customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
                  customer.name ||
                  'My Account'}
              </span>
              <span className="user-email">{customer.email}</span>
            </div>
          </div>
          <nav className="account-nav">
            {NAV_STRUCTURE.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <div className="nav-group" key={tab.href}>
                  <a
                    href={tab.href}
                    className={`nav-tab${isActive ? ' active' : ''}`}
                  >
                    {tab.label}
                  </a>
                  {isActive && tab.subItems.length > 0 && (
                    <div className="nav-subitems">
                      {tab.subItems.map((sub) => (
                        <a href={sub.href} className="nav-subitem" key={sub.href}>
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <a href="#logout" className="nav-item logout" onClick={handleLogout}>
              Logout
            </a>
          </nav>
        </aside>

        <main className="account-content">{children}</main>
      </div>
      <Footer />
    </>
  );
}
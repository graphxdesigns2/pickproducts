'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
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
      { label: 'Email Address', href: '/account#email-preferences' },
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
    ],
  },
];

export default function AccountLayout({ children }) {
  const { customer, loading, logout, refreshCustomer } = useCustomer();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login');
    }
  }, [loading, customer, router]);

  // Re-fetch customer context when changing routes
  useEffect(() => {
    if (customer && refreshCustomer) {
      refreshCustomer();
    }
  }, [pathname]);

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
              const isActive =
                tab.href === '/account'
                  ? pathname === '/account'
                  : pathname.startsWith(tab.href);

              return (
                <div className="nav-group" key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`nav-tab${isActive ? ' active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tab.label}
                  </Link>
                  {isActive && tab.subItems.length > 0 && (
                    <div className="nav-subitems">
                      {tab.subItems.map((sub) => (
                        <Link
                          href={sub.href}
                          className="nav-subitem"
                          key={sub.href}
                        >
                          {sub.label}
                        </Link>
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

        {/* key={pathname} forces children components to remount fresh on route change */}
        <main className="account-content" key={pathname}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
'use client';

import React, { useState } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0';

import PageLink from './PageLink';
import AnchorLink from './AnchorLink';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="nav-container" data-testid="navbar">
      <Navbar color="light" light expand="md" className="py-3 shadow-sm border-bottom">
        <Container>
          <PageLink href="/" className="navbar-brand fw-bold fs-4 text-primary text-decoration-none">
            Home
          </PageLink>

          <NavbarToggler onClick={toggle} data-testid="navbar-toggle" />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="ms-auto d-flex align-items-center gap-3" navbar>

              {/* Stats link */}
              <NavItem>
                <PageLink href="/stats" className="btn btn-outline-primary px-3 py-1">
                  📊 Stats
                </PageLink>
              </NavItem>

              {/* Raw data link */}
              <NavItem>
                <PageLink href="/raw" className="btn btn-outline-secondary px-3 py-1">
                  📄 Raw Data
                </PageLink>
              </NavItem>

              {/* Auth buttons */}
              {!isLoading && !user && (
                <NavItem className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      sessionStorage.setItem('loginMethod', 'passkey');
                      sessionStorage.setItem('loginStart', Date.now().toString());
                      window.location.href = '/auth/login';
                    }}>
                    🔐 Log in with Passkey
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      sessionStorage.setItem('loginMethod', '2fa');
                      sessionStorage.setItem('loginStart', Date.now().toString());
                      window.location.href = '/auth/login';
                    }}>
                    📱 Log in with 2FA
                  </button>
                </NavItem>
              )}

              {/* User profile dropdown */}
              {user && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="rounded-circle border"
                      width="40"
                      height="40"
                      decode="async"
                    />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem>
                      <PageLink href="/profile" icon="user">
                        Profile
                      </PageLink>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <AnchorLink href="/auth/logout" icon="power-off">
                        Log out
                      </AnchorLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;

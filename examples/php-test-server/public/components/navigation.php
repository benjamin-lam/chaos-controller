<nav data-testid="main-nav" class="main-nav">
    <style>
        .main-nav {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .main-nav .nav-links,
        .mobile-nav ul {
            list-style: none;
            display: flex;
            gap: 12px;
            padding: 0;
            margin: 0;
        }

        .main-nav a {
            text-decoration: none;
            color: inherit;
        }

        #menu-toggle {
            display: none;
            padding: 8px 12px;
            border: 1px solid #ccc;
            background: #f5f5f5;
            cursor: pointer;
        }

        .mobile-nav {
            display: none;
            flex-direction: column;
            gap: 8px;
            border: 1px solid #ccc;
            padding: 10px;
            background: #fff;
        }

        .mobile-nav.open {
            display: flex;
        }

        @media (max-width: 768px) {
            #menu-toggle {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

            .desktop-nav {
                display: none;
            }
        }
    </style>
    <button id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav">☰ Menü</button>
    <ul class="nav-links desktop-nav">
        <li><a href="/" data-testid="nav-home">Home</a></li>
        <li><a href="/shop.php" data-testid="nav-shop">Shop</a></li>
        <li><a href="/contact.php" data-testid="nav-contact">Kontakt</a></li>
        <li><a href="/login.php" data-testid="nav-login">Login</a></li>
        <li><a href="/dashboard.php" data-testid="nav-dashboard">Dashboard</a></li>
        <li><a href="/forms/registration.php" data-testid="nav-registration">Registration</a></li>
        <li><a href="/forms/upload.php" data-testid="nav-upload">Upload</a></li>
    </ul>
    <div id="mobile-nav" class="mobile-nav" aria-hidden="true">
        <ul>
            <li><a href="/" data-testid="mobile-nav-home">Home</a></li>
            <li><a href="/shop.php" data-testid="mobile-nav-shop">Shop</a></li>
            <li><a href="/contact.php" data-testid="mobile-nav-contact">Kontakt</a></li>
            <li><a href="/login.php" data-testid="mobile-nav-login">Login</a></li>
            <li><a href="/dashboard.php" data-testid="mobile-nav-dashboard">Dashboard</a></li>
            <li><a href="/forms/registration.php" data-testid="mobile-nav-registration">Registration</a></li>
            <li><a href="/forms/upload.php" data-testid="mobile-nav-upload">Upload</a></li>
        </ul>
    </div>
    <script>
        (function () {
            const toggle = document.getElementById('menu-toggle');
            const mobileNav = document.getElementById('mobile-nav');
            if (!toggle || !mobileNav) return;

            toggle.addEventListener('click', () => {
                const isOpen = mobileNav.classList.toggle('open');
                mobileNav.setAttribute('aria-hidden', String(!isOpen));
                toggle.setAttribute('aria-expanded', String(isOpen));
            });
        })();
    </script>
</nav>

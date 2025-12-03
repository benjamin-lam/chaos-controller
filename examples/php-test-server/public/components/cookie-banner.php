<?php
$consentCookie = $_COOKIE['cookie_consent'] ?? null;
?>
<div id="cookie-banner" data-testid="cookie-banner" style="<?php echo $consentCookie ? 'display:none;' : '' ?> border: 1px solid #ccc; padding: 12px; margin: 10px 0; background: #f9f9f9;">
    <p>Wir verwenden Cookies, um Tests besser zu machen.</p>
    <div style="display: flex; gap: 8px;">
        <button type="button" id="cookie-accept" data-testid="cookie-accept">Akzeptieren</button>
        <button type="button" id="cookie-decline" data-testid="cookie-decline">Ablehnen</button>
    </div>
</div>
<script>
    (function () {
        const banner = document.getElementById('cookie-banner');
        const accept = document.getElementById('cookie-accept');
        const decline = document.getElementById('cookie-decline');
        if (!banner || !accept || !decline) return;

        const setConsent = (value) => {
            const expires = new Date();
            expires.setDate(expires.getDate() + 365);
            document.cookie = `cookie_consent=${value}; expires=${expires.toUTCString()}; path=/`;
            banner.style.display = 'none';
        };

        accept.addEventListener('click', () => setConsent('accepted'));
        decline.addEventListener('click', () => setConsent('declined'));
    })();
</script>

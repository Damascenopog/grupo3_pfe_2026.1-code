(() => {
    const patterns = {
        name: /^[A-Za-zÀ-ÿ' -]{3,}$/u,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
        phone: /^\(\d{2}\)\s?(?:9?\d{4})-?\d{4}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i,
        text: /^(?=.*\S).{3,}$/u,
    };

    function normalize(value) {
        return String(value ?? "").trim();
    }

    function isName(value) {
        return patterns.name.test(normalize(value));
    }

    function isEmail(value) {
        return patterns.email.test(normalize(value));
    }

    function isPhone(value) {
        return patterns.phone.test(normalize(value));
    }

    function isPassword(value) {
        return patterns.password.test(normalize(value));
    }

    function isLinkedIn(value) {
        const input = normalize(value);
        return input === "" || patterns.linkedin.test(input);
    }

    function hasText(value, minLength = 3) {
        return (
            normalize(value).length >= minLength &&
            patterns.text.test(normalize(value))
        );
    }

    function isSelected(value) {
        return normalize(value).length > 0;
    }

    function isChecked(element) {
        return Boolean(element && element.checked);
    }

    window.ACBForms = {
        patterns,
        normalize,
        isName,
        isEmail,
        isPhone,
        isPassword,
        isLinkedIn,
        hasText,
        isSelected,
        isChecked,
    };
})();

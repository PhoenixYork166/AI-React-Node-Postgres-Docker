const { printDateTime } = require('../../util/printDateTime');

exports.handleSignout = (req, res) => {
    printDateTime();

    const requestHandlerName = `handleSignout`;

    if (req.session) {
        // Destroy the session and clear the 'userData' cookie.
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to sign out.' });
            }

            console.log(`\nreq.session is being revoked\n`);

            res.clearCookie('userData', { path: '/', secure: process.env.NODE_ENV === 'production' });
            res.status(200).json({ success: true, message: 'Sign out successful.' });
        });
    } else {
        res.status(200).json({ success: true, message: 'No session to clear.' });
    }
};

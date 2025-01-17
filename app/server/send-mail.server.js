import { sendEmail } from "./nodemailer.server";

export async function InstallationEmail(data) {
    const { shop } = data;

    await sendEmail(
        shop.contactEmail,
        'Welcome to ProfitSuite! 🎉',
        '',
        `
        <p>Hello '${shop.name}' Team</p>
        <p>Welcome aboard! 🎉 We're thrilled to have you as part of the <a href="https://apps.shopify.com/profitsuite" target="_blank">ProfitSuite</a> community and can't wait to see how our app transforms your store's bundling experience.</p>
        <p>To ensure everything runs smoothly, we're offering a <strong>personalized onboarding session</strong>. Our team will walk you through the setup and tailor the app to fit your store's specific needs.</p>
        <p>Here are some resources to help you hit the ground running:</p>
        <ul>
            <li><strong>Create Your First Offer</strong> – <a href="" target="_blank">Watch the step-by-step guide</a></li>
            <li><strong>Create a Volume Discount</strong> – <a href="" target="_blank">Learn how</a></li>
            <li><strong>Create a Combo Discount</strong> – <a href="" target="_blank">Watch here</a></li>
        </ul>

        <p>If you have any questions, need custom solutions, or want to book your onboarding session, our team is here to help. You can reply to this email or reach out via the chat support feature in the app.</p>
        <p>Excited to see what you'll create with ProfitSuite. 🚀</p>
        <p>Warm regards</p>
        `
    );
    return shop;
}

export async function appUninstallationEmail(storeInfo) {
    await sendEmail(
        storeInfo.contactEmail,
        'ProfitSuite: We hate goodbyes 😢',
        '',
        `
        <p>Hi ${storeInfo.name} team,</p>
        We hope you’re having an amazing day! We were thrilled to see that you gave <a href="https://apps.shopify.com/profitsuite" target="_blank">ProfitSuite</a> a try, but noticed that you uninstalled the app shortly after. 
        <p>We’d really appreciate it if you could take a moment to share your feedback. Was there a specific feature you were hoping for that we didn’t offer, or did you encounter any challenges while using the app?</p>
       
        <p>We’re also offering personalized onboarding and custom solutions tailored to meet your store’s specific needs. We’d love to hop on a quick call to discuss how we can support you if there’s something specific you’re looking for. Let us know, and we’ll make it happen!</p>
        <p>You can reinstall the app using this link: <a href="https://apps.shopify.com/profitsuite" target="_blank">ProfitSuite on Shopify</a></p>
        <p>Looking forward to hearing from you. Let's get you bundling again!</p>
        <p>Warm regards,</p>
        `
    );

    return storeInfo;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

export async function dataDeletionEmail(storeInfo, uninstallDate) {
    const formattedDate = formatDate(uninstallDate);
    await sendEmail(
        storeInfo.contactEmail,
        'Important: ProfitSuite Data Deletion Notice 📊',
        '',
        `
        <p>Hello ${storeInfo.name} Team,</p>
        <p>We hope this email finds you well! 👋 We wanted to reach out with an important update regarding your ProfitSuite data.</p>
        <p>As per Shopify's guidelines and policy, we will be removing your data from our servers. This includes:</p>
        <ul>
            <li>Offer configurations</li>
            <li>Customer interaction data</li>
            <li>Analytics and performance metrics</li>
            <li>Any custom settings or preferences</li>
        </ul>
        <p><strong>Important Note:</strong> This deletion only affects data within ProfitSuite and does not impact your Shopify store data. 🛍️</p>
        <p>🔄 <strong>Want to keep your ProfitSuite data?</strong> It's simple! Just reinstall ProfitSuite before ${formattedDate}, and all your data will remain intact. You can quickly reinstall using this link: <a href="https://apps.shopify.com/profitsuite" target="_blank">ProfitSuite on Shopify</a></p>
        <p>We'd hate to see you go :(!</p>
        <p>If you have any questions, concerns, or need assistance with anything, please don't hesitate to reach out. We're always here to help! 💬</p>
        <p>Thank you for being a part of the ProfitSuite community. We hope to continue serving your disocunt needs in the future!</p>
        <p>Best regards,</p>
        `
    );

    return storeInfo;
}
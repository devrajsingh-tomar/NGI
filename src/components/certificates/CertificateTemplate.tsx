
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, for now standard fonts
// If you want custom fonts, you can register them:
// Font.register({ family: 'Roboto', src: ... });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40,
        fontFamily: 'Helvetica',
        position: 'relative',
    },
    border: {
        border: '4px solid #1a237e', // Deep Blue
        margin: 10,
        padding: 30,
        height: '92%',
        position: 'relative',
    },
    watermark: {
        position: 'absolute',
        top: '25%',
        left: '25%',
        width: '50%',
        height: 'auto',
        opacity: 0.1,
        transform: 'rotate(-45deg)',
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    instituteParams: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    instituteName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a237e',
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    instituteSub: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#d4af37', // Gold
        textAlign: 'center',
        marginVertical: 10,
        textTransform: 'uppercase',
        fontFamily: 'Times-Roman',
        fontSize: 32,
        letterSpacing: 2,
    },
    body: {
        marginTop: 0,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 1.6,
        color: '#333',
    },
    studentName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textDecoration: 'underline',
        marginVertical: 5,
        fontFamily: 'Times-Bold',
    },
    courseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a237e',
        fontFamily: 'Times-Bold',
    },
    detailsTable: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 10,
        color: '#666',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    signatureBlock: {
        alignItems: 'center',
        borderTop: '1px solid #333',
        width: 200,
        paddingTop: 10,
    },
    signLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    signSub: {
        fontSize: 10,
        color: '#666',
    },
    qrSection: {
        alignItems: 'center',
    },
    qrCode: {
        width: 60,
        height: 60,
        marginBottom: 2,
    },
    certId: {
        fontSize: 10,
        color: '#555',
    },
    seal: {
        position: 'absolute',
        bottom: 80,
        right: '46%', // Center-ish
        width: 80,
        height: 80,
        opacity: 0.8,
    },
});

interface CertificateProps {
    studentName: string;
    courseName: string;
    certificateId: string;
    issueDate: string;
    grade: string;
    percentage: string;
    qrCodeUrl: string; // Base64 or URL
    duration: string;
    wpm?: string;
}

export const CertificateTemplate = ({
    studentName,
    courseName,
    certificateId,
    issueDate,
    grade,
    percentage,
    qrCodeUrl,
    duration,
    wpm
}: CertificateProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.border}>

                {/* Background Watermark - Placeholder */}
                {/* <Image 
            src="https://via.placeholder.com/500x500.png?text=NGI Study Zone" 
            style={styles.watermark} 
        /> */}

                {/* Header with Logo & Institute Name */}
                <View style={styles.instituteParams}>
                    {/* Replace with actual logo URL/Base64 in production */}
                    {/* <Image src="/logo.png" style={styles.logo} /> */}
                    <Text style={styles.instituteName}>NGI Study Zone Institute</Text>
                    <Text style={styles.instituteSub}>
                        Run by Chowdhry Law Chambers • ISO 9001:2015 Certified
                    </Text>
                    <Text style={styles.instituteSub}>
                        123, Education Lane, Knowledge Park, New Delhi - 110001
                    </Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>Certificate of Completion</Text>

                {/* Body Text */}
                <View style={styles.body}>
                    <Text>This is to certify that</Text>
                    <Text style={styles.studentName}>{studentName}</Text>
                    <Text>has successfully completed the course</Text>
                    <Text style={styles.courseName}>{courseName}</Text>
                    <Text>
                        with a duration of {duration}, achieving a Grade of {grade} ({percentage}%).
                    </Text>
                </View>

                {/* Technical Details */}
                <View style={styles.detailsTable}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Certificate ID</Text>
                        <Text style={styles.detailValue}>{certificateId}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Issue Date</Text>
                        <Text style={styles.detailValue}>{issueDate}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Grade</Text>
                        <Text style={styles.detailValue}>{grade}</Text>
                    </View>
                    {wpm && (
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Typing Speed</Text>
                            <Text style={styles.detailValue}>{wpm} WPM</Text>
                        </View>
                    )}
                </View>

                {/* Footer with Signatures & QR */}
                <View style={styles.footer}>

                    <View style={styles.signatureBlock}>
                        {/* <Image src="/signature.png" style={{height: 40, marginBottom: -10}} /> */}
                        <Text style={styles.signLabel}>Director</Text>
                        <Text style={styles.signSub}>Academics</Text>
                    </View>

                    <View style={styles.qrSection}>
                        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
                        <Text style={styles.certId}>Scan to Verify</Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        {/* <Image src="/signature2.png" style={{height: 40, marginBottom: -10}} /> */}
                        <Text style={styles.signLabel}>Exam Controller</Text>
                        <Text style={styles.signSub}>NGI Study Zone Institute</Text>
                    </View>

                </View>

                {/* Seal */}
                {/* <Image src="/seal.png" style={styles.seal} /> */}

            </View>
        </Page>
    </Document>
);

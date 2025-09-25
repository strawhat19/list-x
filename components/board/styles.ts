import { web } from '@/shared/variables';
import { StyleSheet } from 'react-native';
import { borderRadius, colors } from '@/components/theme/Themed';

export const cardImageWidth = web() ? `25%` : `33%`;

export const cardedBorder = {
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
}

export const cardedBorderRight = {
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
}

export const boardStyles = StyleSheet.create({
    rowItem: {
        width: `100%`,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    card: {
        gap: 15,
        padding: 0,
        borderRadius,
        display: 'flex',
        overflow: `hidden`,
        flexDirection: `row`,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.appleBlue,
    },
    absolute: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    handleStyle: {
        width: 75,
        height: 4,
        borderRadius: 3,
    },
    bottomSheetBackground: {
        backgroundColor: colors.transparent,
    },
    contentContainer: {
        flex: 1,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
    },
    wrapper: {
        gap: 15,
        padding: 16,
    },
    cardImageContainer: {
        margin: 0,
        width: cardImageWidth,
        backgroundColor: `transparent`,
    },
    cardRight: {
        gap: 0,
        flex: 1,
        display: `flex`,
        paddingVertical: 30,
        flexDirection: `column`,
        backgroundColor: `transparent`,
    },
    cardTitle: {
        fontSize: 20,
        color: `white`,
        fontWeight: `bold`,
    },
    cardDescription: {
        fontSize: 16,
        color: `white`,
        display: `flex`,
        maxWidth: `95%`,
        flexWrap: `wrap`,
    },
    cardImage: {
        flex: 1,
        margin: 0,
        maxWidth: 115,
        marginTop: -1,
        marginLeft: -2,
        maxHeight: `auto`,
        ...(web() && {
            maxHeight: 500,
            maxWidth: `auto`,
        })
    },
})
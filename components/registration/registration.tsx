import { roles, User } from '@/shared/models/User';
import { SharedContext } from '@/shared/shared';
import { Views } from '@/shared/types/types';
import { capWords, genID, hapticFeedback, itemHeight, log } from '@/shared/variables';
import { FontAwesome } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { titleRowStyles } from '../board/column/column';
import ForwardRefInput from '../custom-input/forward-ref-input';
import Page, { defaultChildren } from '../page/page';
import { colors, globalStyles, Text, View } from '../theme/Themed';

export enum AuthStates {
    SignIn = `Sign In`,
    SignUp = `Sign Up`,
    NoUsers = `No Users`,
    SignOut = `Sign Out`,
    SignedIn = `Signed In`,
    SignedOut = `Signed Out`,
    ResetPassword = `Reset Password`,
    ForgotPassword = `Forgot Password`,
}

export default function Registration({ }) {
    const { user, setUser, userLoading, updateUser } = useContext<any>(SharedContext);

    let [email, setEmail] = useState(``);
    let [typing, setTyping] = useState(false);
    let [password, setPassword] = useState(``);
    let [showPassword, setShowPassword] = useState(false);

    const onFocus = () => {
        setTyping(true);
        hapticFeedback();
    }

    const onCancel = () => {
        setTyping(false);
        hapticFeedback();
    }
    
    const onSign = (authState: AuthStates) => {
        let usr = null;
        if (authState == AuthStates.SignUp || authState == AuthStates.SignIn) {
            let newUsrID = genID(Views.User, 1);
            let { id, uuid, title } = newUsrID;
            let defaultRole = roles.Subscriber;
            usr = new User({ 
                id, 
                uuid, 
                email, 
                title, 
                password, 
                uid: uuid, 
                name: capWords(email), 
                role: defaultRole.name,
                level: defaultRole.level,
            });
        }
        log(`On ${authState}`, usr);
        setEmail(``);
        setPassword(``);
        hapticFeedback();
        // if (setUser != undefined && setUser != null) setUser(usr);
        if (updateUser) {
            updateUser(usr);
        }
    }

    return (
        <Page topMargin={typing ? -315 : -100} gap={typing ? 0 : 55} logoSize={typing ? 115 : undefined} titleFontSize={typing ? 45 : undefined}>
            {user == null ? (
                <View style={{ backgroundColor: colors.transparent, justifyContent: `center`, alignItems: `center` }}>
                    <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 5, justifyContent: `center`, marginHorizontal: `auto` }]}>
                        <ForwardRefInput
                            gap={0}
                            value={email}
                            width={`100%`}
                            showLabel={true}
                            onDoneDismiss={true}
                            onDoneVibrate={true}
                            autoComplete={`email`}
                            endIconDisabled={true}
                            autoCapitalize={`none`}
                            onChangeText={setEmail}
                            endIconPress={() => {}}
                            endIconName={`envelope`}
                            doneColor={colors.active}
                            onFocus={() => onFocus()}
                            onBlur={() => onCancel()}
                            cancelColor={colors.active}
                            onCancel={() => onCancel()}
                            placeholder={`Email Address`}
                            keyboardType={`email-address`}
                            textContentType={`emailAddress`}
                            doneText={email == `` ? `Done` : `Enter`}
                            onDone={email == `` ? () => {} : () => {}}
                            cancelText={email == `` ? `Close` : `Cancel`}
                            endIconColor={email == `` ? colors.disabledFont : colors.inputColor}
                            extraStyle={{ 
                                width: `85%`, 
                                fontWeight: `bold`,
                                color: colors.inputColor, 
                                backgroundColor: colors.navy, 
                                fontStyle: email == `` ? `italic` : `normal`,
                            }}
                            style={{ 
                                marginBottom: 0, 
                                minHeight: itemHeight, 
                                ...globalStyles.flexRow, 
                            }}
                            endIconStyle={{ 
                                minHeight: itemHeight, 
                                maxHeight: itemHeight, 
                                backgroundColor: colors.navy, 
                            }}
                        />
                    </View>
                    <View style={[globalStyles.singleLineInput, titleRowStyles.addItemButton, { marginTop: 5, justifyContent: `center`, marginHorizontal: `auto` }]}>
                        <ForwardRefInput
                            gap={0}
                            width={`100%`}
                            endIconSize={23}
                            value={password}
                            showLabel={true}
                            onDoneVibrate={true}
                            onDoneDismiss={true}
                            autoCapitalize={`none`}
                            endIconDisabled={false}
                            placeholder={`Password`}
                            autoComplete={`password`}
                            onFocus={() => onFocus()}
                            onBlur={() => onCancel()}
                            doneColor={colors.active}
                            onChangeText={setPassword}
                            onCancel={() => onCancel()}
                            cancelColor={colors.active}
                            secureTextEntry={!showPassword}
                            doneText={password == `` ? `Done` : `Enter`}
                            onDone={password == `` ? () => {} : () => {}}
                            endIconName={showPassword ? `eye-slash` : `eye`}
                            cancelText={password == `` ? `Close` : `Cancel`}
                            endIconPress={() => setShowPassword(!showPassword)}
                            endIconColor={password == `` ? colors.disabledFont : colors.inputColor}
                            extraStyle={{ 
                                width: `85%`, 
                                fontWeight: `bold`,
                                color: colors.inputColor, 
                                backgroundColor: colors.navy, 
                                fontStyle: password == `` ? `italic` : `normal`,
                            }}
                            style={{ 
                                marginBottom: 0, 
                                minHeight: itemHeight, 
                                ...globalStyles.flexRow, 
                            }}
                            endIconStyle={{ 
                                minHeight: itemHeight, 
                                maxHeight: itemHeight, 
                                backgroundColor: colors.navy, 
                            }}
                        />
                    </View>
                    {!typing && (
                        <View style={[globalStyles.flexRow, { paddingHorizontal: 15, backgroundColor: colors.transparent, gap: 15 }]}>
                            <TouchableOpacity onPress={() => onSign(AuthStates.SignUp)} disabled={email == `` || password == ``} style={[globalStyles.flexRow, { backgroundColor: colors.navy, width: `47.5%`, paddingHorizontal: 10, borderRadius: 5, minHeight: itemHeight - 5, marginTop: 15, justifyContent: `center`, gap: 5 }]}>
                                <FontAwesome name={`user-plus`} color={(email == `` || password == ``) ? colors.disabled : colors.white} />
                                <Text style={{ ...styles.text, width: `auto`, color: (email == `` || password == ``) ? colors.disabled : colors.white }}>
                                    {AuthStates.SignUp}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onSign(AuthStates.SignIn)} disabled={email == `` || password == ``} style={[globalStyles.flexRow, { backgroundColor: colors.navy, width: `47.5%`, paddingHorizontal: 10, borderRadius: 5, minHeight: itemHeight - 5, marginTop: 15, justifyContent: `center`, gap: 5 }]}>
                                <FontAwesome name={`user`} color={(email == `` || password == ``) ? colors.disabled : colors.white} />
                                <Text style={{ ...styles.text, width: `auto`, color: (email == `` || password == ``) ? colors.disabled : colors.white }}>
                                    {AuthStates.SignIn}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                userLoading ? (
                    defaultChildren.loading
                ) : (
                    <View style={[globalStyles.flexRow, { width: `100%`, justifyContent: `center`, padding: 15, backgroundColor: colors.transparent, gap: 0, flexDirection: `column` }]}>
                        <Text style={{ ...styles.text, width: `100%` }}>
                            Welcome, {user.name}
                        </Text>
                        <TouchableOpacity onPress={() => onSign(AuthStates.SignOut)} style={[globalStyles.flexRow, { backgroundColor: colors.navy, width: `100%`, paddingHorizontal: 10, borderRadius: 5, minHeight: itemHeight - 5, marginTop: 15, gap: 5 }]}>
                            <FontAwesome size={14} name={`sign-out`} color={colors.white} />
                            <Text style={{ ...styles.text, width: `auto`, color: colors.white, }}>
                                {AuthStates.SignOut}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            )}
        </Page>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 14, 
        fontWeight: `bold`, 
        textAlign: `center`,
        fontStyle: `italic`, 
    }
})
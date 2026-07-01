import {Button, Checkbox, NativeSelect, PasswordInput, SimpleGrid, TextInput} from "@mantine/core";
import {hasLength, isEmail, matchesField, useForm} from "@mantine/form";
import {RegisterAccountRequest} from "../../../../types.ts";
import {useFormErrorResponseHandler} from "../../../../hooks/useFormErrorResponseHandler.tsx";
import {useRegisterAccount} from "../../../../mutations/useRegisterAccount.ts";
import {NavLink, useLocation, useNavigate} from "react-router";
import {t, Trans} from "@lingui/macro";
import classes from "./Register.module.scss";
import {getClientLocale} from "../../../../locales.ts";
import {useEffect} from "react";
import {getUserCurrency} from "../../../../utilites/currency.ts";
import {getConfig} from "../../../../utilites/config.ts";
import {captureUtmData, getStoredUtmData, clearStoredUtmData} from "../../../../utilites/utm.ts";

const ATTENDEE_PROFILE_STORAGE_KEY = 'movve_attendee_profiles_v1';

const bloodTypeOptions = [
    {value: '', label: t`Select`},
    {value: 'A+', label: 'A+'},
    {value: 'A-', label: 'A-'},
    {value: 'B+', label: 'B+'},
    {value: 'B-', label: 'B-'},
    {value: 'AB+', label: 'AB+'},
    {value: 'AB-', label: 'AB-'},
    {value: 'O+', label: 'O+'},
    {value: 'O-', label: 'O-'},
];

const normalizeCpf = (cpf?: string | null) => (cpf || '').replace(/\D/g, '');

const saveRegistrationProfile = (data: RegisterAccountRequest) => {
    if (typeof window === 'undefined') {
        return;
    }

    const cpf = normalizeCpf(data.cpf);
    if (!cpf) {
        return;
    }

    try {
        const existingProfiles = JSON.parse(localStorage.getItem(ATTENDEE_PROFILE_STORAGE_KEY) || '[]');
        const profiles = Array.isArray(existingProfiles) ? existingProfiles : [];
        const profile = {
            id: cpf,
            cpf,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            blood_type: data.blood_type || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || '',
        };

        localStorage.setItem(
            ATTENDEE_PROFILE_STORAGE_KEY,
            JSON.stringify([
                profile,
                ...profiles.filter((item) => item.id !== cpf),
            ].slice(0, 25))
        );
    } catch {
        localStorage.setItem(ATTENDEE_PROFILE_STORAGE_KEY, JSON.stringify([]));
    }
};

export const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            cpf: '',
            blood_type: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            timezone: typeof window !== 'undefined'
                ? Intl.DateTimeFormat().resolvedOptions().timeZone
                : 'UTC',
            locale: getClientLocale(),
            invite_token: '',
            currency_code: getUserCurrency(),
            marketing_opt_in: false,
        },
        validate: {
            password: hasLength({min: 8}, t`Password must be at least 8 characters`),
            password_confirmation: matchesField('password', t`Passwords are not the same`),
            email: isEmail(t`Please check your email is valid`),
        },
    });
    const errorHandler = useFormErrorResponseHandler();
    const mutate = useRegisterAccount();

    const registerUser = (data: RegisterAccountRequest) => {
        saveRegistrationProfile(data);

        const utmData = getStoredUtmData();
        const registrationData = utmData ? {...data, ...utmData} : data;

        mutate.mutate({registerData: registrationData}, {
            onSuccess: () => {
                clearStoredUtmData();
                navigate(`/welcome${location.search}`);
            },
            onError: (error: any) => {
                errorHandler(form, error, error.response?.data?.message);
            },
        });
    }

    useEffect(() => {
        captureUtmData();

        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('invite_token');

        if (token) {
            form.setFieldValue('invite_token', token);
        }
    }, [location.search]);

    return (
        <>
            <header className={classes.header}>
                <h2>{t`Get started`}</h2>
                <p>
                    <Trans>
                        Already have an account?{' '}
                        <NavLink to={`/auth/login${location.search}`}>
                            {t`Log in`}
                        </NavLink>
                    </Trans>
                </p>
            </header>

            <div className={classes.registerCard}>
                <form onSubmit={form.onSubmit((values) => registerUser(values as RegisterAccountRequest))}>

                    <SimpleGrid verticalSpacing={{base: "md", sm: 0}} cols={{base: 1, sm: 2}} mb="md">
                        <TextInput
                            {...form.getInputProps('first_name')}
                            label={t`First Name`}
                            placeholder={t`John`}
                            required
                        />
                        <TextInput
                            {...form.getInputProps('last_name')}
                            label={t`Last Name`}
                            placeholder={t`Smith`}
                        />
                    </SimpleGrid>

                    <TextInput
                        mb={0}
                        {...form.getInputProps('email')}
                        label={t`Email`}
                        placeholder={'your@email.com'}
                        required
                    />

                    <SimpleGrid verticalSpacing={{base: "md", sm: 0}} cols={{base: 1, sm: 2}} mt="md" mb="md">
                        <TextInput
                            {...form.getInputProps('cpf')}
                            label={t`CPF`}
                            placeholder="000.000.000-00"
                        />
                        <NativeSelect
                            {...form.getInputProps('blood_type')}
                            label={t`Blood Type`}
                            data={bloodTypeOptions}
                        />
                    </SimpleGrid>

                    <SimpleGrid verticalSpacing={{base: "md", sm: 0}} cols={{base: 1, sm: 2}} mb="md">
                        <TextInput
                            {...form.getInputProps('emergency_contact_name')}
                            label={t`Emergency Contact`}
                            placeholder={t`Emergency contact name`}
                        />
                        <TextInput
                            {...form.getInputProps('emergency_contact_phone')}
                            label={t`Emergency Phone`}
                            placeholder={t`Emergency phone`}
                        />
                    </SimpleGrid>

                    <SimpleGrid verticalSpacing={{base: "md", sm: 0}} cols={{base: 1, sm: 2}} mt="md" mb="md">
                        <PasswordInput
                            {...form.getInputProps('password')}
                            label={t`Password`}
                            placeholder={t`Your password`}
                            required
                        />
                        <PasswordInput
                            {...form.getInputProps('password_confirmation')}
                            label={t`Confirm Password`}
                            placeholder={t`Confirm password`}
                            required
                        />
                    </SimpleGrid>

                    <TextInput
                        style={{display: 'none'}}
                        {...form.getInputProps('timezone')}
                        type="hidden"
                    />

                    <Checkbox
                        mb="md"
                        {...form.getInputProps('marketing_opt_in', {type: 'checkbox'})}
                        label={<Trans>Receive product updates from {getConfig("VITE_APP_NAME", "Orbita Sports")}.</Trans>}
                    />

                    <Button color="secondary.5" type="submit" fullWidth disabled={mutate.isPending}>
                        {mutate.isPending ? t`Working...` : t`Register`}
                    </Button>
                </form>
                <footer>
                    <Trans>
                        By registering you agree to our <NavLink target={'_blank'}
                                                                 to={getConfig("VITE_TOS_URL", "https://orbitasports.com/terms-of-service?utm_source=app-register-footer") as string}>Terms
                        of Service</NavLink> and <NavLink
                        target={'_blank'}
                        to={getConfig("VITE_PRIVACY_URL", 'https://orbitasports.com/privacy-policy?utm_source=app-register-footer') as string}>Privacy Policy</NavLink>.
                    </Trans>
                </footer>
            </div>
        </>
    )
}

export default Register;

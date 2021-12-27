import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../utils/firebaseClient";
import { AppLayout } from "./layouts/AppLayout";
import { PageSpinner } from "./shared/PageSpinner";
import { SignInForm } from "./forms/SignInForm";
import { NextPage } from "next";

export interface IPageProps {
    user: firebase.User;
}

export const withAuthentication = (Page: NextPage<IPageProps>) => {
    return () => {
        try {
            const [user, loading, error] = useAuthState(firebase.auth());

            return (
                <AppLayout user={user}>
                    {loading && !user && <PageSpinner />}
                    {!loading && !user && !error && <SignInForm />}
                    {!loading && user && !error && <Page user={user} />}
                </AppLayout>
            );
        } catch {
            // firebase appcheck fails in nextjs prerender return a spinner instead
            return (
                <AppLayout user={undefined}>
                    <PageSpinner />
                </AppLayout>
            );
        }
    };
};

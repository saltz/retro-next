import React, {useEffect, useState} from "react";
import {Switch} from "antd";
import {DarkModeIcon} from "./icons/DarkModeIcon";
import {LightModeIcon} from "./icons/LightModeIcon";
import {parseCookies, setCookie} from "nookies";

interface IProps {
}

type ThemeType = "light" | "dark"

export const ThemeSwitch: React.FC<IProps> = (props: IProps): JSX.Element => {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>("light");

    useEffect(() => {
        const {theme} = parseCookies();

        setCurrentTheme(theme as ThemeType ?? "light");
    }, []);

    useEffect(() => {
        document.querySelector("html").className = currentTheme;
    }, [currentTheme]);

    const onThemeSwitch = (value: boolean): void => {
        const selectedTheme = value ? "dark" : "light";

        setCurrentTheme(selectedTheme);

        setCookie(null, "theme", selectedTheme, {
            maxAge: 31536000,
            path: "/",
        })
    };

    return (
        <>
            <div className="theme-switch">
                <Switch
                    checked={currentTheme === "dark"}
                    onChange={onThemeSwitch}
                    checkedChildren={<DarkModeIcon style={{marginTop: "2px"}}/>}
                    unCheckedChildren={<LightModeIcon style={{marginTop: "2.3px"}}/>}
                />
            </div>
            <style jsx>
                {`
                  .theme-switch {
                    position: fixed;
                    z-index: 999;
                    top: 30px;
                    left: 30px;
                  }
                `}
            </style>
        </>
    )
        ;
};
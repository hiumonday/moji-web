import React from "react";
import Container from "./container";
import { useTranslation } from 'react-i18next';
import initiativeOneImg from "../assets/img/vnwqo.jpeg";
import initiativeTwoImg from "../assets/img/echo.jpeg";
import initiativeThreeImg from "../assets/img/comm.webp";
import initiativeFourImg from "../assets/img/disney.png";
import SectionTitle from "./sectionTitle";

const Initiatives = () => {
    const { t, i18n } = useTranslation();

    const initiatives = t('initiativeslist', { returnObjects: true });

    return (
        <div className="bg-white pb-8"> {/* Change this line */}
            <SectionTitle
                pretitle={t('initiativePretitle')}
                title={t('initiativeTitle')}
            />
            <Container>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                    {initiatives.map((initiative, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"> {/* Change this line */}
                            <div className="relative">
                                <img
                                    src={index === 0 ? initiativeOneImg : index === 1 ? initiativeTwoImg : index === 2 ? initiativeThreeImg : initiativeFourImg}
                                    alt={initiative.title}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-10"></div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between"> {/* Change this line */}
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">{initiative.title}</h3>
                                    <p className="text-gray-600 text-base mb-4">{initiative.description}</p>
                                </div>
                              
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Initiatives;
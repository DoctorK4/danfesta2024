'use client';

import { post } from '@/api';
import { API_ROUTES } from '@/constants';
import { useBottomSheet } from '@/hooks';
import { BottomSheet, Form } from '@components/common';
import { Funnel, Header } from '@components/signup';
import { TransformerSubtitle } from '@components/signup';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@components/ui/accordion';
import { APIError, isStudentId } from '@lib/utils';
import { AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { DKUVerificationSchema, dkuVerificationSchema } from './schema';

const steps = ['학번', '비밀번호', '약관동의'] as const;

type DKUResponse = {
    signupToken: string;
    student: {
        studentName: string;
        studentId: string;
        age: string;
        gender: string;
        major: string;
    };
};

type Steps = (typeof steps)[number];

export default function Page() {
    const [step, setStep] = useState<Steps>('학번');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isOpen, openBT, closeBT] = useBottomSheet();
    const passwordRef = useRef<HTMLInputElement>(null);
    const currentStep = steps.indexOf(step);
    const isLastStep = currentStep === steps.length;
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isReverify = searchParams.get('reverify') === 'true';

    const verify = async (dkuData: DKUVerificationSchema) => {
        try {
            setIsLoading(true);
            const { signupToken } = await post<
                DKUVerificationSchema,
                DKUResponse
            >(API_ROUTES.user.dku.verify, dkuData);
            setToken(signupToken);
            onNext(steps[currentStep]);
        } catch (error) {
            const message = error as APIError;
            toast.error(message.message);
        } finally {
            setIsLoading(false);
        }
    };

    const reverify = async (dkuData: DKUVerificationSchema) => {
        try {
            await post<DKUVerificationSchema, {}>(
                API_ROUTES.user.dku.reverify,
                dkuData,
            );
            toast.success('재인증이 완료되었습니다.');
            router.push('/');
        } catch (error) {
            const message = error as APIError;
            toast.error(message.message);
        }
    };

    const handleSubmit = async (dkuData: DKUVerificationSchema) => {
        switch (step) {
            case '학번':
            case '비밀번호':
                isReverify ? reverify(dkuData) : verify(dkuData);
                break;
            case '약관동의':
                router.push(`/${locale}/signup/phone?token=${token}`);
        }
    };

    const onNext = (currentStep: Steps) => {
        if (isLastStep) return;
        if (currentStep === '학번') {
            setStep('비밀번호');
        } else if (currentStep === '비밀번호') {
            setStep('약관동의');
            openBT();
        }
    };

    useEffect(() => {
        const t = requestAnimationFrame(() => {
            if (passwordRef.current) {
                passwordRef.current.focus();
            }
        });
        return () => cancelAnimationFrame(t);
    }, [step]);

    return (
        <section className="flex flex-col px-5">
            <AnimatePresence initial={false}>
                <Header>
                    <Header.Title>단국대학교 재학생 인증</Header.Title>
                    <Header.Subtitle>
                        {step === '학번' && (
                            <TransformerSubtitle text="학번을" />
                        )}
                        {step === '비밀번호' && (
                            <TransformerSubtitle text="비밀번호를" />
                        )}
                        {step === '약관동의' && (
                            <TransformerSubtitle text="약관에 동의해주세요." />
                        )}
                        {step !== '약관동의' && (
                            <div className="ml-1">입력해주세요.</div>
                        )}
                    </Header.Subtitle>
                </Header>
                <Form
                    onSubmit={handleSubmit}
                    schema={dkuVerificationSchema}
                    validateOn="onChange"
                >
                    <Funnel<typeof steps> step={step} steps={steps}>
                        <Funnel.Step name="비밀번호">
                            <Form.Password
                                ref={passwordRef}
                                name="dkuPassword"
                                label="단국대학교 포털 비밀번호"
                                placeholder="8자 이상의 영문, 숫자"
                            />
                        </Funnel.Step>
                        <Funnel.Step name="학번">
                            <Form.ID
                                name="dkuStudentId"
                                label="단국대학교 포털 아이디"
                                placeholder="숫자 8자리"
                                onChange={async (event) => {
                                    if (
                                        isStudentId(event.target.value) &&
                                        step === '학번'
                                    ) {
                                        onNext(steps[currentStep]);
                                    }
                                    return event.target.value;
                                }}
                            />
                        </Funnel.Step>
                    </Funnel>

                    <BottomSheet
                        isOpen={isOpen}
                        header="이용동의"
                        onDismiss={() => {
                            setStep('비밀번호');
                            closeBT();
                        }}
                    >
                        <Terms />
                        <Form.Button isLoading={isLoading} variant="filled">
                            동의
                        </Form.Button>
                    </BottomSheet>

                    <Form.Button variant="bottom">다음</Form.Button>
                </Form>
            </AnimatePresence>
        </section>
    );
}

function Terms() {
    return (
        <Accordion type="single" collapsible className="w-full mb-10 text-sm">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    어떤 정보를 제공해야 하나요?
                </AccordionTrigger>
                <AccordionContent>
                    단페스타 2024 서비스를 이용하기 위해서는 다음과 같은 정보를
                    제공해야합니다.
                    <ul>
                        <li> - 학번</li>
                        <li> - 단국대학교 포털 비밀번호</li>
                        <li> - 전화번호</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    제공한 정보는 어디에 사용되나요?
                </AccordionTrigger>
                <AccordionContent>
                    제공된 정보는 단페스타 2024 서비스 이용을 위한 목적으로만
                    사용되며 다른 목적으로 사용되지 않습니다.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    포털 비밀번호도 제공해야 하나요?
                </AccordionTrigger>
                <AccordionContent>
                    단국대학교 포털 비밀번호는 학생 인증을 위한 목적으로만
                    사용되며 즉시 삭제됩니다.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

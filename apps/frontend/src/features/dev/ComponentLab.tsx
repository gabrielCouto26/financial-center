import React from 'react';
import { Button } from '../../design-system/Button/Button';
import { Input } from '../../design-system/Input/Input';
import { Card } from '../../design-system/Card/Card';
import { Badge } from '../../design-system/Badge/Badge';
import { IconWallet, IconCards, IconLightbulb, IconArrowRight, IconPlus } from '../../design-system/Icons';

export const ComponentLab: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <header>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>Component Lab</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Verification of Design System components based on Figma.</p>
      </header>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Buttons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="primary" icon={<IconPlus size={16} />}>New Expense</Button>
          <Button variant="text" icon={<IconArrowRight size={16} />} iconPosition="right">Text Button</Button>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Input Fields</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <Input label="Transaction Name" placeholder="Gourmet Dinner" />
          <Input label="Amount" placeholder="$ 124.50" />
          <Input label="Category" defaultValue="Groceries" error="Required field" />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Cards & Widgets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Card variant="primary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Balance</span>
                <h3 style={{ fontSize: '36px', margin: '8px 0', fontFamily: 'var(--font-display)' }}>$24,850.00</h3>
              </div>
              <Badge variant="info">+2.4%</Badge>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
              <IconWallet size={24} opacity={0.8} />
              <IconCards size={24} opacity={0.8} />
            </div>
          </Card>

          <Card variant="insight">
            <div style={{ display: 'flex', gap: '16px' }}>
              <IconLightbulb size={32} />
              <div>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>Editorial Insight</h3>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '16px' }}>Your dining spend is 15% higher than last month.</p>
                <Button variant="secondary" size="sm" style={{ borderColor: 'white', color: 'white' }}>REVIEW TRENDS</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Badges</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Badge variant="success">INCOME</Badge>
          <Badge variant="danger">EXPENSE</Badge>
          <Badge variant="warning">PENDING</Badge>
          <Badge variant="info">PERSONAL</Badge>
          <Badge variant="neutral">DEPOSIT</Badge>
        </div>
      </section>
    </div>
  );
};
